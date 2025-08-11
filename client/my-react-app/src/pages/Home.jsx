import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import likedImg from '../liked.png';
import unlikedImg from '../unliked.png';
import cryptocrybLogo from '../cryptocryb.png';

function Home() {
  const [listOfPosts, setListOfPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [eurAmount, setEurAmount] = useState('');
  const [cryptoRates, setCryptoRates] = useState({
    bitcoin: 0,
    ethereum: 0,
    solana: 0,
    binancecoin: 0,
  });
  const [news, setNews] = useState([]);
  const [newsLoading, setNewsLoading] = useState(true);
  const [newsOpen, setNewsOpen] = useState(false);

  // For facts widget
  const [factOpen, setFactOpen] = useState(false);
  const [randomFact, setRandomFact] = useState('');

  const navigate = useNavigate();

  // Fetch random fact from backend
  const fetchRandomFact = async () => {
    try {
      const response = await axios.get('http://localhost:2222/facts/random');
      setRandomFact(response.data.factText);
      console.log("Fetched random fact:", response.data.factText);
    } catch (error) {
      console.error("Error fetching random fact:", error);
      setRandomFact("Could not load a fact at this time.");
    }
  };

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    const userId = storedUserId ? parseInt(storedUserId) : null;

    axios.get('http://localhost:2222/posts').then((response) => {
      setListOfPosts(response.data);

      if (!userId) {
        setLikedPosts({});
        return;
      }

      const likedPostsFromBackend = {};
      response.data.forEach(post => {
        likedPostsFromBackend[post.id] = post.Likes.some(
          like => like.userId === userId
        );
      });

      setLikedPosts(likedPostsFromBackend);
    });

    axios.get('https://api.coingecko.com/api/v3/simple/price', {
      params: {
        ids: 'bitcoin,ethereum,solana,binancecoin',
        vs_currencies: 'eur',
      }
    }).then(response => {
      setCryptoRates({
        bitcoin: response.data.bitcoin.eur,
        ethereum: response.data.ethereum.eur,
        solana: response.data.solana.eur,
        binancecoin: response.data.binancecoin.eur,
      });
    }).catch(err => {
      console.error("Error fetching crypto rates:", err);
    });

    const fetchNews = async () => {
      try {
        const apiKey = '23d0b9233ddc4eb091dc3724e281f3bc';
        const response = await axios.get(
          `https://newsapi.org/v2/everything?q=cryptocurrency OR bitcoin OR ethereum&language=en&sortBy=publishedAt&pageSize=5&apiKey=${apiKey}`
        );
        setNews(response.data.articles);
      } catch (error) {
        console.error('Error fetching crypto news:', error);
      } finally {
        setNewsLoading(false);
      }
    };
    fetchNews();

    // Initial random fact fetch
    fetchRandomFact();
  }, []);

  // When fact panel opens, fetch a new fact
  useEffect(() => {
    if (factOpen) {
      fetchRandomFact();
    }
  }, [factOpen]);

  const likeAPost = (postId) => {
    const isLiked = likedPosts[postId];

    axios.post(
      "http://localhost:2222/likes",
      { postId: postId, like: !isLiked },
      { headers: { accessToken: localStorage.getItem("accessToken") } }
    ).then(() => {
      setLikedPosts((prev) => ({
        ...prev,
        [postId]: !isLiked,
      }));

      setListOfPosts((prevList) =>
        prevList.map((post) => {
          if (post.id === postId) {
            return {
              ...post,
              Likes: !isLiked
                ? [...post.Likes, { userId: parseInt(localStorage.getItem("userId")) }]
                : post.Likes.filter(like => like.userId !== parseInt(localStorage.getItem("userId"))),
            };
          }
          return post;
        })
      );
    });
  };

  const isLoggedIn = !!localStorage.getItem("userId");

  const filteredPosts = listOfPosts.filter(post => 
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.postText.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const calcCryptoAmount = (rate) => {
    const eur = parseFloat(eurAmount);
    if (isNaN(eur) || eur <= 0 || rate === 0) return "0.00";
    return (eur / rate).toFixed(6);
  };

  const getNewFact = () => {
    fetchRandomFact();
  };

  return (
    <>
      {/* Top logo bar */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', padding: '10px' }}>
        <img src={cryptocrybLogo} alt="CryptoCryb" style={{ height: '150px' }} />
      </div>

      {/* Search + Converter */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', gap: '20px', padding: '10px', flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 300px', minWidth: '280px' }}>
          <input
            type="text"
            placeholder="Search posts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '100%', padding: '8px 12px', fontSize: '16px', borderRadius: '8px', border: '1px solid #ccc' }}
          />
        </div>

        <div style={{
          flex: '1 1 400px',
          maxWidth: 400,
          padding: 20,
          background: 'rgba(255, 77, 166, 0.15)',
          borderRadius: 20,
          boxShadow: '0 4px 12px rgba(255, 77, 166, 0.3)',
          fontFamily: "'Arial', sans-serif",
          color: '#a74574',
          textAlign: 'center',
        }}>
          <h3 style={{ marginBottom: 15 }}>Convert EUR to Crypto</h3>
          <input
            type="number"
            min="0"
            placeholder="Amount in EUR"
            value={eurAmount}
            onChange={(e) => setEurAmount(e.target.value)}
            style={{
              padding: '10px',
              width: '80%',
              fontSize: '16px',
              borderRadius: '8px',
              border: '1px solid #ff4da6',
              marginBottom: 20,
              textAlign: 'center',
            }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-around' }}>
            <div><strong>BTC</strong><div>{calcCryptoAmount(cryptoRates.bitcoin)} BTC</div></div>
            <div><strong>ETH</strong><div>{calcCryptoAmount(cryptoRates.ethereum)} ETH</div></div>
            <div><strong>SOL</strong><div>{calcCryptoAmount(cryptoRates.solana)} SOL</div></div>
            <div><strong>BNB</strong><div>{calcCryptoAmount(cryptoRates.binancecoin)} BNB</div></div>
          </div>
        </div>
      </div>

      {/* Posts */}
      <div style={{ padding: '0 20px 20px 20px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '30px' }}>
        {filteredPosts.slice()
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .map((value, key) => (
            <div className="post" key={key} style={{ marginBottom: 20 }}>
              <div className="title">{value.title}</div>
              <div className="body" onClick={() => navigate(`/post/${value.id}`)} style={{ cursor: 'pointer' }}>
                {value.postText}
              </div>
              {value.coinSymbol && (
                <div style={{ color: '#a74174ff', fontWeight: '300', fontStyle: 'italic', fontSize: '12px', marginBottom: '6px' }}>
                  {value.coinSymbol}
                </div>
              )}
              <div className="footer" style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', gap: '10px', paddingRight: '20px' }}>
                <span style={{ color: 'white' }}>{value.username}</span>
                {isLoggedIn && (
                  <button
                    onClick={(e) => { e.stopPropagation(); likeAPost(value.id); }}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                  >
                    <img src={likedPosts[value.id] ? likedImg : unlikedImg} alt="like button" style={{ width: '20px', height: '20px' }} />
                  </button>
                )}
                <label className="like-count" style={{ color: 'white', fontWeight: 'bold' }}>
                  {value.Likes ? value.Likes.length : 0}
                </label>
              </div>
            </div>
          ))}
      </div>

      {/* News Sticker (right) */}
      <div
        style={{
          position: 'fixed',
          top: '50%',
          right: 0,
          transform: 'translateY(-50%)',
          width: newsOpen ? 320 : 40,
          height: newsOpen ? '70vh' : 120,
          background: 'rgba(255, 148, 211, 0.85)',
          color: '#a74574',
          borderTopLeftRadius: 20,
          borderBottomLeftRadius: 20,
          boxShadow: '0 8px 20px rgba(255, 148, 211, 0.4)',
          overflow: 'hidden',
          fontFamily: "'Arial', sans-serif",
          zIndex: 9999,
          transition: 'width 0.3s ease, height 0.3s ease',
          cursor: 'pointer',
          display: 'flex',
          flexDirection: 'column',
        }}
        onClick={() => setNewsOpen(!newsOpen)}
      >
        <div style={{
          writingMode: 'vertical-rl',
          textOrientation: 'upright',
          fontWeight: 'bold',
          fontSize: 16,
          padding: '10px 5px',
          background: '#ff4da6',
          color: 'white',
          userSelect: 'none',
          flexShrink: 0,
          textAlign: 'center',
        }}>
          {newsOpen ? "Crypto News" : "News"}
        </div>
        {newsOpen && (
          <div style={{ flex: 1, overflowY: 'auto', padding: 10, fontSize: 14 }} onClick={e => e.stopPropagation()}>
            {newsLoading ? (
              <div>Loading news...</div>
            ) : (
              news.map((article, i) => (
                <div
                  key={i}
                  style={{
                    marginBottom: 20,
                    paddingBottom: 10,
                    borderBottom: '1px solid #ff4da6',
                    cursor: 'pointer',
                  }}
                  onClick={() => window.open(article.url, '_blank')}
                >
                  <h4 style={{ margin: '0 0 5px 0', color: '#a74574' }}>{article.title}</h4>
                  <p style={{ margin: 0, fontSize: '12px', color: '#333' }}>{article.source.name}</p>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Fact sticker (left) */}
      <div
        style={{
          position: 'fixed',
          top: '50%',
          left: 0,
          transform: 'translateY(-50%)',
          width: factOpen ? 320 : 40,
          height: factOpen ? '50vh' : 100,
          background: 'rgba(255, 148, 211, 0.85)',
          color: '#a74574',
          borderTopRightRadius: 20,
          borderBottomRightRadius: 20,
          boxShadow: '0 8px 20px rgba(255, 148, 211, 0.4)',
          overflow: 'hidden',
          fontFamily: "'Arial', sans-serif",
          zIndex: 9999,
          transition: 'width 0.3s ease, height 0.3s ease',
          cursor: 'pointer',
          display: 'flex',
          flexDirection: 'column',
        }}
        onClick={() => setFactOpen(!factOpen)}
      >
        <div style={{
          writingMode: 'vertical-rl',
          textOrientation: 'upright',
          fontWeight: 'bold',
          fontSize: 16,
          padding: '10px 5px',
          background: '#ff4da6',
          color: 'white',
          userSelect: 'none',
          flexShrink: 0,
          textAlign: 'center',
        }}>
          {factOpen ? "Crypto Fact" : "Fact"}
        </div>
        {factOpen && (
          <div
            style={{
              flex: 1,
              padding: 10,
              fontSize: 14,
              textAlign: 'center',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
            onClick={e => e.stopPropagation()}
          >
            <p style={{ marginBottom: 15 }}>{randomFact}</p>
            <button
              onClick={(e) => { e.stopPropagation(); getNewFact(); }}
              style={{
                background: '#ff4da6',
                color: 'white',
                padding: '6px 12px',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 'bold',
                alignSelf: 'center',
              }}
            >
              New Fact
            </button>
          </div>
        )}
      </div>
    </>
  );
}

export default Home;
