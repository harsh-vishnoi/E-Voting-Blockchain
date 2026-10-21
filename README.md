# E-Voting on Ethereum

A Truffle project for an election run by one commissioner. Candidates register a party name, the commissioner opens and closes the poll, and each other address can vote once. The contract records the winner, or a draw, in events on the chain.

The web client in `app/` talks to the contract through Web3 and MetaMask.

## Contract

`contracts/Vote_Contract.sol` (Solidity 0.5).

| Action | Who | What it does |
| --- | --- | --- |
| `Register_Candidate` | Any address except the commissioner | Registers that address under a party name, while registration is open and voting has not started |
| `Start_voting` / `End_voting` | Commissioner (the deploying account) | Opens the poll, or closes it and picks the winner |
| `Register_Vote` | Any address except the commissioner | Casts one vote for a registered candidate while the poll is open |
| `End_Party_Registration` / `Start_Party_Registration` | Commissioner | Stops or reopens candidate registration |

The deployer is the commissioner. A candidate cannot vote for their own address. Ending the vote calls `Set_Winner`, which emits `Winner` or `Draw`.

## Layout

| Path | What it is |
| --- | --- |
| `contracts/Vote_Contract.sol` | Election contract |
| `migrations/` | Truffle deployment |
| `test/metacoin.js` | Truffle test scaffold |
| `app/` | Webpack client (`npm run dev` serves the UI) |
| `truffle-config.js` | Networks. Development is the Truffle default on port 9545 |
| `WebAppIntro.png` | Screenshot of the client |

There is no `package.json` at the repository root. Node dependencies live in `app/package.json`.

## Run

Install Truffle 5.x, which matches Solidity 0.5. Use a Node release that can still run Webpack 4 and `web3` 1.2 (Node 10 through 14). Current Node and Truffle releases do not match this dependency set.

```bash
cd app
npm install
cd ..
truffle compile
truffle migrate
cd app
npm run dev
```

Open the address printed by webpack-dev-server (the original notes used `http://localhost:8080`) in a browser where MetaMask is connected to the same network Truffle migrated to.

![Voting client](WebAppIntro.png)
