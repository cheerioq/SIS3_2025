const express = require("express");
const app = express();
const cors = require("cors");

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

const db = require("./models");

// Seed facts if the CryptoFacts table is empty
async function seedFacts() {
  const count = await db.CryptoFacts.count();
  if (count === 0) {
    await db.CryptoFacts.bulkCreate([
      { factText: "Bitcoin’s supply is capped at 21 million coins." },
      { factText: "Ethereum transitioned to Proof-of-Stake in 2022." },
      { factText: "The first Bitcoin transaction was for 2 pizzas worth about $41 at the time — today worth hundreds of millions." },
      { factText: "Solana can process over 65,000 transactions per second." },
      { factText: "Binance Coin is used for discounted trading fees on Binance." },
      { factText: "The term ‘HODL’ came from a drunk BitcoinTalk forum post in 2013 titled 'I AM HODLING'." },
      { factText: "Dogecoin was created as a joke but reached over $80 billion market cap in 2021." },
      { factText: "Private keys are the most important thing to protect in crypto — lose them, lose your coins forever." },
      { factText: "The identity of Bitcoin's creator, Satoshi Nakamoto, is still unknown." },
      { factText: "There’s a Bitcoin wallet from 2009 with over 1 million BTC that has never been touched." },
      { factText: "A lost hard drive with 8,000 BTC is buried in a landfill in Wales — worth hundreds of millions." },
      { factText: "In 2010, Bitcoin’s price rose from $0.003 to $0.08 in just 5 days." },
      { factText: "Vitalik Buterin co-founded Ethereum at just 19 years old." },
      { factText: "CryptoKitties once clogged the Ethereum network because so many people were trading virtual cats." },
      { factText: "El Salvador became the first country to adopt Bitcoin as legal tender in 2021." },
      { factText: "A man once paid for a space flight ticket with Bitcoin." },
      { factText: "There are more than 23,000 cryptocurrencies in existence as of 2025." },
      { factText: "Some Bitcoin ATMs charge fees of over 20% per transaction." },
      { factText: "In 2013, a Norwegian man discovered his forgotten $27 Bitcoin investment was worth $886,000." },
      { factText: "The phrase ‘Not your keys, not your coins’ means if you don’t control the private key, you don’t own the crypto." },
      { factText: "Litecoin’s block time is 2.5 minutes — four times faster than Bitcoin’s 10 minutes." },
      { factText: "The smallest unit of Bitcoin is called a Satoshi — 1 BTC equals 100 million Satoshis." },
      { factText: "The Ethereum network can execute smart contracts, which are self-executing programs on the blockchain." },
      { factText: "The first NFT ever created was 'Quantum' by Kevin McCoy in 2014." },
      { factText: "The total value locked in DeFi protocols exceeded $100 billion in 2021." },
      { factText: "Tether (USDT) is the first and largest stablecoin by market cap." },
      { factText: "Bitcoin mining uses more electricity annually than some entire countries." },
      { factText: "Ripple (XRP) is designed for fast and cheap cross-border payments." },
      { factText: "Polygon (MATIC) is a scaling solution for Ethereum that lowers gas fees." },
      { factText: "Cardano (ADA) was founded by Charles Hoskinson, a co-founder of Ethereum." },
      { factText: "In 2021, an NFT artwork by Beeple sold for $69 million at Christie’s." },
      { factText: "The first country to launch its own central bank digital currency (CBDC) was the Bahamas with the Sand Dollar." },
      { factText: "Binance became the largest crypto exchange in the world in under two years." },
      { factText: "Bitcoin’s first block, the 'Genesis Block', contains a hidden message about bank bailouts." },
      { factText: "Wrapped Bitcoin (WBTC) is Bitcoin represented on the Ethereum network." },
      { factText: "Ethereum gas fees can spike during periods of high network congestion." },
      { factText: "Cold wallets store cryptocurrencies offline for maximum security." },
      { factText: "In 2020, PayPal began allowing users to buy, sell, and hold cryptocurrencies." },
      { factText: "The phrase 'Flippening' refers to Ethereum potentially overtaking Bitcoin in market cap." },
      { factText: "The Lightning Network is a second-layer Bitcoin solution for faster transactions." },
      { factText: "Proof-of-Work and Proof-of-Stake are the two most common blockchain consensus mechanisms." },
      { factText: "Crypto whales are individuals or entities holding extremely large amounts of cryptocurrency." },
      { factText: "Metamask is one of the most popular crypto wallets for interacting with decentralized apps." },
      { factText: "Shiba Inu (SHIB) was created as a meme coin but gained millions of holders." },
      { factText: "In 2021, the total crypto market cap surpassed $3 trillion for the first time." },
      { factText: "Some countries have completely banned cryptocurrency trading and mining." },
      { factText: "The first Bitcoin ATM was installed in Vancouver, Canada in 2013." },
      { factText: "Mining difficulty in Bitcoin adjusts every 2,016 blocks to maintain a 10-minute block time." },
      { factText: "Blockchain technology is being used in supply chains, voting systems, and healthcare." },
      { factText: "Some artists now release music albums as NFTs for direct fan ownership." },
    ]);
    console.log("✅ Seeded CryptoFacts table with 50 facts");
  }
}

// Test route
app.get("/", (req, res) => {
  res.send("API is running");
});

// Associate models if they have associations
Object.values(db).forEach((model) => {
  if (model.associate) {
    model.associate(db);
  }
});

// Routers
const postsRouter = require("./routes/Posts");
app.use("/posts", postsRouter);

const commentsRouter = require("./routes/Comments");
app.use("/comments", commentsRouter);

const usersRouter = require("./routes/Users");
app.use("/auth", usersRouter);

const likesRouter = require("./routes/Likes");
app.use("/likes", likesRouter);

const reportRouter = require("./routes/Report");
app.use("/report", reportRouter);

const cryptoFactsRouter = require("./routes/CryptoFacts");
app.use("/facts", cryptoFactsRouter);

db.sequelize.sync({ alter: true }).then(async () => {
  console.log("DB synced");

  // Run your seedFacts or other startup logic here
  await seedFacts();

  app.listen(2222, () => {
    console.log("Server running on port 2222");
  });
});