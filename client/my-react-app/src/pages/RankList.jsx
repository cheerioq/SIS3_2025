import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function RankList() {
  const [rankings, setRankings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://88.200.63.148:2222/ranklist")
      .then((res) => {
        let users = Array.isArray(res.data) ? res.data : [];

        // Sort users by coins amount descending (just in case)
        users.sort((a, b) => (b.Coins?.amount ?? 0) - (a.Coins?.amount ?? 0));

        setRankings(users);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching rank list:", err);
        setError(true);
        setLoading(false);
      });
  }, []);

  const handleUserClick = (id) => {
    navigate(`/profile/${id}`);
  };

  if (loading) return <div className="loading">Loading rankings...</div>;
  if (error) return <div className="loading">Error loading rankings.</div>;

  return (
    <div className="ranklist-container">
      <h1 className="title">🌸 Rank List 🌸</h1>

      <table className="rank-table">
        <thead>
          <tr>
            <th>#</th>
            <th>User</th>
            <th>Total Coins</th>
          </tr>
        </thead>
        <tbody>
          {rankings.map((user, index) => (
            <tr key={user.id}>
              <td className="rank-number">{index + 1}</td>
              <td>
                <span
                  className="username-link"
                  onClick={() => handleUserClick(user.id)}
                >
                  {user.username}
                </span>
              </td>
           <td>{(user.amount ?? 0).toLocaleString()} 🪙</td>





            </tr>
          ))}
        </tbody>
      </table>

      <style>{`
        .ranklist-container {
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding-top: 100px;
          font-family: Arial, Helvetica, sans-serif;
        }
        .title {
          font-size: 36px;
          color: #ff1ab8;
          text-shadow: 0 0 10px #ff66b3;
          margin-bottom: 30px;
        }
        .rank-table {
          width: 90%;
          max-width: 800px;
          border-collapse: collapse;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
          background: linear-gradient(
            to bottom,
            rgba(255, 255, 255, 0.9),
            rgba(255, 148, 211, 0.3)
          );
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
        }
        .rank-table th,
        .rank-table td {
          padding: 14px 20px;
          text-align: left;
          border-bottom: 1px solid #ffccd9;
          color: #a74574;
        }
        .rank-table th {
          background-color: #ffb2e4;
          color: white;
          font-weight: bold;
          text-transform: uppercase;
        }
        .rank-table tr:nth-child(even) {
          background: rgba(255, 255, 255, 0.6);
        }
        .rank-table tr:hover {
          background: rgba(255, 148, 211, 0.4);
          transform: scale(1.02);
          transition: all 0.3s ease;
          cursor: pointer;
        }
        .rank-number {
          font-weight: bold;
          color: #ff3399;
        }
        .username-link {
          cursor: pointer;
          color: #ff1ab8;
          font-weight: bold;
          transition: color 0.2s;
        }
        .username-link:hover {
          color: #ff66b3;
          text-decoration: underline;
        }
        .loading {
          margin-top: 120px;
          font-family: 'Arial', sans-serif;
          color: #ff66b3;
          text-align: center;
          font-size: 24px;
        }
      `}</style>
    </div>
  );
}

export default RankList;
