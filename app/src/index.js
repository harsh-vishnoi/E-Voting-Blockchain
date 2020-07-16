import { default as Web3 } from "web3";
import { default as contract } from "truffle-contract";
import $ from "jquery";

import VotingContractArtifacts from "../../build/contracts/Vote_Contract.json";

var Vote_Contract = contract(VotingContractArtifacts);
var Vote_Contract_Instance, CurAccount, Commissioner;
var Stop_party_registeration = false, Voting_End = true;
var TotalVotes = 0;

window.App = {
    start: async function() {
      var self = this;

      //set provider
      Vote_Contract.setProvider(web3.currentProvider);

      //get Accounts
      web3.eth.getAccounts(function(err, accs) {
        if(err != null){
            alert("There was an error fetching your accounts");
            return;
        }

        if(accs.length == 0){
            alert("Counldn't get any accounts! Make sure your Ethereum Client is configured correctly");
            return;
        }

        CurAccount = accs[0];

        //Creating COntract Instance
        Vote_Contract.new({from: CurAccount, gas: 3000000}).then(instance => {
            Vote_Contract_Instance = instance;
            Commissioner = CurAccount;
            console.log(Vote_Contract_Instance);
            console.log("*******************************************");
            console.log("Co mmissioner Address -> ", CurAccount);
            console.log("Contract Address -> ", Vote_Contract_Instance.address);
            console.log("*******************************************");
            $("#rMessage").empty();
            $("#rMessage").append("Registration is live");
          })
        });

        //Listening to Events
        ethereum.on('accountsChanged', function (accounts) {
          App.getAccount();
        })
    },

    getAccount : async function(){
      const accounts = await ethereum.enable();
      CurAccount = accounts[0];

      if(CurAccount == Commissioner){
          $("#Voting_Status").show();
          $("#Registration_Status").show();
      }else{
          $("#Voting_Status").hide();
          $("#Registration_Status").hide();
      }

      console.log("Accounts Switched!");
      console.log("CurAccount : ", CurAccount);
      $("#info").empty();
      $("#info").append("<Text>Current Account : " + CurAccount + "</Text>");
      $("#error").empty();
    },

    Switch_Register : async function() {
      if(Stop_party_registeration == false){
        Vote_Contract_Instance.End_Party_Registration({from: CurAccount}).then(tx => {
          console.log(tx);
          $("#rMessage").empty();
          if(tx.logs[0].event == "Registration_stopped"){
            $("#info").empty();
            $("#error").empty();
            $("#rMessage").append("<Text>Registration has been Stopped</Text>");
          }
        })
      }else{
        Vote_Contract_Instance.Start_Party_Registration({from: CurAccount}).then(tx => {
          console.log(tx);
          $("#rMessage").empty();
          if(tx.logs[0].event == "Registration_started"){
            $("#info").empty();
            $("#error").empty();
            $("#rMessage").append("<Text>Registration is Live</Text>");
          }
        })
      }
    },

    Switch_Vote : async function(){
      if(Voting_End == false){
        Vote_Contract_Instance.End_voting({from: CurAccount}).then(tx => {
          console.log(tx);
          $("#vMessage").empty();
          if(tx.logs[1].event == "Voting_stopped"){
            $("#info").empty();
            $("#error").empty();
            $("#vMessage").append("<Text>Voting has been Stopped</Text>");
          }
          Voting_End = true;

          if(tx.logs[0].event == "Draw"){
            $("#info").append("<Text>Oops! Its a Draw</Text>");
          }else if(tx.logs[0].event == "Winner"){
            $("#info").append("<Text>" + tx.logs[0].event.add + " won the elections</Text>");
          }
        })
      }else{
        Vote_Contract_Instance.Start_voting({from: CurAccount}).then(tx => {
          console.log(tx);
          $("#vMessage").empty();
          Voting_End = false;
          if(tx.logs[0].event == "Voting_started"){
            $("#info").empty();
            $("#error").empty();
            $("#vMessage").append("<Text>Voting is Live</Text>");
          }
        })
      }
    },

    Register_Button : async function() {
      var candidate_Name = prompt("Name of the Candidate");
      if(CurAccount == Commissioner){
         console.log("Oops! Wrong Address. Commissioner can not register as an Candidate");
         $("#error").empty();
         $("#error").append("<Text>Oops! Wrong Address. Commissioner can not register as an Candidate</Text>");
         $("#info").empty();
      }else{
          Vote_Contract_Instance.Register_Candidate(candidate_Name, {from: CurAccount}).then(tx => {
            console.log(tx);
            $("#info").empty();
            $("#RegList").remove();
            if(tx.logs[0].event == "Registered_event"){
                $("#error").empty();
                $("#info").append("<Text>Candidate has been Successfully registered</Text>");
                console.log("Candidate has been Successfully registered");
                console.log("*******************************************");
                console.log("Candidate Name ------", tx.logs[0].args.name);
                console.log("Candidate Address ---", tx.logs[0].args.add);
                console.log("*******************************************");
                $("#theList").append("<li>" + tx.logs[0].args.name + "</li>");
                $("#select_tag").append("<option value = " + tx.logs[0].args.add + ">" + tx.logs[0].args.name + " </option>)");
            }
          })
      }
    },

    Vote : async function() {
        var candidate_add = $('#select_tag :selected').val();
        if(candidate_add == null){
          console.log("There are no registered Candidates");
          $("#info").empty();
          $("#error").empty();
          $("#error").append("<Text>There are no registered Candidates</Text>");
        }else if(candidate_add == CurAccount){
          $("#info").empty();
          $("#error").empty();
          $("#error").append("<Text>You can't Vote for Yourself</Text>");
        }else{
          $("#error").empty();
          Vote_Contract_Instance.Register_Vote(candidate_add, {from: CurAccount,gas: 3000000}).then(txResult => {
              TotalVotes += 1;
              $("#info").empty();
              $("#info").append("<Text>Vote has been successfully casted</Text>");
              $("#total_Votes").text("Total Votes Registered " + TotalVotes);
              console.log("Candidate Address : ", candidate_add);
              console.log(txResult);
          });
        }
    }
};

window.addEventListener("load", function() {
  if (window.ethereum) {
    App.web3 = new Web3(window.ethereum);
    window.ethereum.enable();
  } else {
    console.warn(
      "No web3 detected. Falling back to http://127.0.0.1:8545. You should remove this fallback when you deploy live",
    );
    App.web3 = new Web3(
      new Web3.providers.HttpProvider("http://127.0.0.1:8545"),
    );
  }
  // window.web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:8545"));

  App.start();
});
