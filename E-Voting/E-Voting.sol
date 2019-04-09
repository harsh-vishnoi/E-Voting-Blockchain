pragma solidity ^0.4.17;


contract  E_Voting { 

    address private Commissioner;
    bool Voting_End = false;
    bool Stop_party_registeration = false;
    
    struct Candidate{
        uint Votes;
        string Party;
        address Address;
        bool Registered;
    }
    
    struct Voter {
        bool Vote;
        address Candidate;
    }
    
    function E_Voting() public {
        Commissioner = msg.sender;
    }
    
    mapping (address => Candidate) public Registered;
    mapping (address => Voter) public Voters_registered;

    modifier Voting_allowed(){
        if(Voting_End == false){
            _;
        }
    }    
    
    modifier PartyRegistration_allowed(){
        if(Stop_party_registeration == false){
            _;
        }
    }
    
    function Register_Candidate(string Party) public PartyRegistration_allowed returns (string) {

        if(msg.sender != Commissioner){
            var x = Registered[msg.sender];
            if(x.Registered == false){
                    x.Votes = 0;
                    x.Party = Party;
                    x.Address = msg.sender;
                    x.Registered = true;
                return "Registered Successfully";
            }    
            else{
                return "You are already Registered";   
            }
        }
        else{
            return "Change Address ,You are Commissioner right now";
        }
    }
    
    function Register_Vote(address addr) public Voting_allowed returns (string){
        if(msg.sender != Commissioner){
            var x = Voters_registered[msg.sender];
            var y = Registered[addr];
            if(x.Vote == false){
                x.Vote = true;
                x.Candidate = addr;
                y.Votes += 1;
                return "Voted Successfully";
            }else{
                return "You have already Voted";
            }
        }else{
            return "Change Address, You are Commissioner right now";
        }
    }
    
    function End_voting() public {
        if(msg.sender == Commissioner){
            Voting_End = true;
        }
    }  
    
    function End_Party_Registration(){
        if(msg.sender == Commissioner){
            Stop_party_registeration = true;
        }
    }

}
