pragma solidity ^0.5.16;

contract Vote_Contract {

    address private Commissioner;
    bool public Voting_End = true;
    bool public Stop_party_registeration = false;

    event Registered_event(string name, address add);
    event Voted(address add);
    event Voting_stopped();
    event Voting_started();
    event Registration_stopped();
    event Registration_started();
    event Winner(address add);
    event Draw();

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

    address[] public candidate;
    mapping (address => Candidate) public Registered;
    mapping (address => Voter) public Voters_registered;

    function Register_Candidate(string memory Party) public {
        require(msg.sender != Commissioner);
        require(Stop_party_registeration == false);
        require(Voting_End == true);
        Candidate storage x = Registered[msg.sender];
        require(x.Registered == false);
        x.Votes = 0;
        x.Party = Party;
        x.Address = msg.sender;
        x.Registered = true;
        candidate.push(msg.sender);
        emit Registered_event(Party, msg.sender);
    }

    function Register_Vote(address addr) public {
        require(msg.sender != Commissioner);
        require(Voting_End == false);
        require(msg.sender != addr);
        Voter storage x = Voters_registered[msg.sender];
        require(x.Vote == false);
        Candidate storage y = Registered[addr];
        x.Vote = true;
        x.Candidate = addr;
        y.Votes += 1;
        emit Voted(msg.sender);
    }

    function Start_voting() public {
        require(Voting_End == true);
        require(msg.sender == Commissioner);
        Voting_End = false;
        emit Voting_started();
    }

    function End_voting() public {
        require(Voting_End == false);
        require(msg.sender == Commissioner);
        Voting_End = true;
        Set_Winner();
        emit Voting_stopped();
    }

    function Set_Winner() private {
        uint maxVotes;
        address winner;
        bool draw = false;
        uint len = candidate.length;
        for (uint i=0; i<len; i++) {
            if(Registered[candidate[i]].Votes > maxVotes) {
                maxVotes = Registered[candidate[i]].Votes;
                winner = candidate[i];
                draw = false;
            }else if(Registered[candidate[i]].Votes == maxVotes && maxVotes != 0){
                draw = true;
            }
        }

        if(draw)
          emit Draw();
        else
          emit Winner(winner);
    }

    function Start_Party_Registration() public {
        require(Stop_party_registeration == true);
        require(msg.sender == Commissioner);
        Stop_party_registeration = false;
        emit Registration_started();
    }

    function End_Party_Registration() public {
        require(Stop_party_registeration == false);
        require(msg.sender == Commissioner);
        Stop_party_registeration = true;
        emit Registration_stopped();
    }
}
