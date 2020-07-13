pragma solidity ^0.5.16;

contract Vote_Contract {

    address private Commissioner;
    bool public Voting_End = true;
    bool public Stop_party_registeration = false;

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

    constructor() public {
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
        if(Stop_party_registeration == false && Voting_End == true){
            _;
        }
    }

    function Register_Candidate(string memory Party) public PartyRegistration_allowed returns (string memory) {

        if(msg.sender != Commissioner){
            Candidate storage x = Registered[msg.sender];
            if(x.Registered == false){
                    x.Votes = 0;
                    x.Party = Party;
                    x.Address = msg.sender;
                    x.Registered = true;
                return "Registered Successfully";
            }else{
                return "You are already Registered";
            }
        }else{
            return "Change Address ,You are Commissioner right now";
        }
    }

    function Register_Vote(address addr) public Voting_allowed returns (string memory){
        if(msg.sender != Commissioner){
            Voter storage x = Voters_registered[msg.sender];
            Candidate storage y = Registered[addr];
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

    function Start_voting() public {
        require(msg.sender == Commissioner);
        Voting_End = false;
    }

    function End_voting() public {
        if(msg.sender == Commissioner){
            Voting_End = true;
        }
    }

    function End_Party_Registration() internal {
        if(msg.sender == Commissioner){
            Stop_party_registeration = true;
        }
    }

}
