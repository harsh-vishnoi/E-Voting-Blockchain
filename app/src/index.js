import { default as Web3 } from "web3";
import { default as contract } from "truffle-contract";
import $ from "jquery";

import VotingContractArtifacts from "../../build/contracts/Vote_Contract.json";

var Vote_Contract = contract(VotingContractArtifacts);
var Vote_Contract_Instance;
var CurAccount;
var Commissioner;
var TotalVotes = 0;

window.App = {
    start: async function() {
      var self = this;

      //set provider
      Vote_Contract.setProvider(web3.currentProvider);

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

        Vote_Contract.new({from: CurAccount, gas: 3000000}).then(instance => {
            Vote_Contract_Instance = instance;
            Commissioner = CurAccount;
            console.log(Vote_Contract_Instance);
            console.log("*******************************************");
            console.log("Commissioner Address -> ", CurAccount);
            console.log("Contract Address -> ", Vote_Contract_Instance.address);
            console.log("*******************************************");
          })
        });

        ethereum.on('accountsChanged', function (accounts) {
          App.getAccount();
        })
    },

    getAccount : async function(){
      const accounts = await ethereum.enable();
      CurAccount = accounts[0];
      console.log("CurAccount : ", CurAccount);
    },

    Register_Button : async function() {
      var candidate_Name = prompt("Name of the Candidate");
      if(CurAccount == Commissioner){
         console.log("Oops! Wrong Address. Commissioner can not register as an Candidate");
         $("#error").append("<Text>Oops! Wrong Address. Commissioner can not register as an Candidate</Text>");
      }else{
          Vote_Contract_Instance.Register_Candidate(candidate_Name, {from: CurAccount}).then(tx => {
            console.log(tx);
            if(tx.logs[0].event == "Registered_event"){
                $("#error").hide();
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
          $("#error").append("<Text>There are no registered Candidates</Text>");
        }else{
          $("#error").hide();
          Vote_Contract_Instance.Register_Vote(candidate_add, {from: CurAccount,gas: 3000000}).then(txResult => {
              TotalVotes += 1;
              $("#total_Votes").text("Total Votes  " + TotalVotes);
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
