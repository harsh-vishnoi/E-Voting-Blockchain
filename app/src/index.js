import { default as Web3 } from "web3";
import { default as contract } from "truffle-contract";
import $ from "jquery";

import VotingContractArtifacts from "../../build/contracts/Vote_Contract.json";

var Vote_Contract = contract(VotingContractArtifacts);
var Vote_Contract_Instance;
var Owner;

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

        var accounts = accs;
        Owner = accounts[0];

        Vote_Contract.new({from: Owner, gas: 3000000}).then(instance => {
            Vote_Contract_Instance = instance;
            console.log(Vote_Contract_Instance);
            console.log("Owner -> ", Owner);
          })
        });
    },

    Register_Button : async function() {
      var candidate_Name = prompt("Name of the Candidate");
      console.log("Candidate Name : ", candidate_Name);
      Vote_Contract_Instance.Register_Candidate(candidate_Name, {from: Owner}).then(tx => {
        console.log(tx);

        if(tx.logs[0].event == "CommissionerErr"){
            console.log("Oops! Wrong Address. Commissioner can not register as an Candidate");
        }else if(tx.logs[0].event == "Registered_event"){
            console.log("Candidate has been Successfully registered");
            console.log("Candidate Name ------", tx.logs[0].args.name);
            console.log("Candidate Address ---", tx.logs[0].args.add);
            $("#theList").append("<li>" + tx.logs[0].args.name + "</li>");
            $("#select_tag").append("<option value = " + tx.logs[0].args.add + ">" + tx.logs[0].args.name + " </option>)");
        }
      })
    },

    Vote : async function() {
        var candidate_add = prompt("Address of the Candidate");
        console.log("Candidate Address : ", candidate_add);
        Vote_Contract_Instance.Register_Vote(candidate_add, {from: Owner}).then(tx => {
          console.log(tx);
        });
    }
};

window.addEventListener("load", function() {
  // if (window.ethereum) {
  //   App.web3 = new Web3(window.ethereum);
  //   window.ethereum.enable();
  // } else {
  //   console.warn(
  //     "No web3 detected. Falling back to http://127.0.0.1:8545. You should remove this fallback when you deploy live",
  //   );
  //   App.web3 = new Web3(
  //     new Web3.providers.HttpProvider("http://127.0.0.1:8545"),
  //   );
  // }
  window.web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:8545"));

  App.start();
});
