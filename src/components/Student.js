import React, { useState, useEffect, useRef } from "react";
import "../styles/Student.css"; // Keep your styles import here
import { auth } from "./firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { Book, LogOut, Upload } from "lucide-react";

// Updated contestsMock with educator's name
const contestsMock = [
  { id: 1, title: "Math Challenge", attempted: false, educator: "Mr. Smith" },
  { id: 2, title: "Science Quiz", attempted: true, educator: "Mrs. Johnson" },
  { id: 3, title: "History Test", attempted: false, educator: "Dr. Brown" },
  { id: 4, title: "English Exam", attempted: true, educator: "Ms. Davis" },
];

export default function StudentDashboard() {
  const [contests, setContests] = useState([]);
  const [activeTab, setActiveTab] = useState("Active Contests");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profilePic, setProfilePic] = useState(null);
  const [showProfileCard, setShowProfileCard] = useState(false); // State to control profile card visibility
  const fileInputRef = useRef();

  useEffect(() => {
    setContests(contestsMock);

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        const defaultPhoto = `https://robohash.org/${currentUser.email}.png?size=200x200`;
        const userPhoto = currentUser.photoURL || defaultPhoto;
        setUser({
          name: currentUser.displayName || "No Name",
          email: currentUser.email || "No Email",
          photo: userPhoto,
        });
        setProfilePic(userPhoto);
      } else {
        setUser(null);
        setProfilePic(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = () => {
    signOut(auth).then(() => {
      setUser(null);
      window.location.href = "/";
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfilePic(imageUrl);
    }
  };

  const availableContests = contests.filter((c) => !c.attempted);
  const attemptedContests = contests.filter((c) => c.attempted);

  return (
    <div className="student-dashboard">
      <div className="dashboard-header">
        <h1>
          <Book size={24} /> Student Dashboard
        </h1>
        <div
          className="avatar"
          onClick={() => setShowProfileCard(!showProfileCard)}
        >
          {loading ? (
            <div>Loading...</div>
          ) : (
            <img src={profilePic} alt="avatar" className="avatar-img" />
          )}
        </div>
      </div>

      <div className="Stu-tabs">
        <div className="tab-buttons">
          {["Active Contests", "Attempted Contests"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={activeTab === tab ? "active" : ""}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="tab-content">
          {activeTab === "Active Contests" && (
            <div className="card-grid">
              {availableContests.map((contest) => (
                <div key={contest.id} className="card-detail">
                  <h2>{contest.title}</h2>
                  <p>
                    <strong>Educator:</strong> {contest.educator}
                  </p>
                  <button>Start Contest</button>
                </div>
              ))}
            </div>
          )}

          {activeTab === "Attempted Contests" && (
            <div className="card-grid">
              {attemptedContests.map((contest) => (
                <div key={contest.id} className="card-detail">
                  <h2>{contest.title}</h2>
                  <p>
                    <strong>Educator:</strong> {contest.educator}
                  </p>
                  <button className="outline">View Results</button>
                </div>
              ))}
            </div>
          )}
          {/* Profile card modal */}
          {showProfileCard && (
            <div className="profile-card-overlay">
              <div className="profile-card">
                <h2>Profile Info</h2>
                {user ? (
                  <>
                    <img
                      src={profilePic}
                      alt="Profile"
                      className="profile-pic"
                    />
                    <p>
                      <strong>Name:</strong> {user.name}
                    </p>
                    <p>
                      <strong>Email:</strong> {user.email}
                    </p>

                    {/* Button Group */}
                    <div className="profile-btn-group">
                      <button
                        className="change-pic-btn"
                        onClick={() => fileInputRef.current.click()}
                      >
                        <Upload size={16} /> Change Picture
                      </button>
                      <button className="logout-btn" onClick={handleLogout}>
                        <LogOut size={18} /> Logout
                      </button>
                    </div>

                    {/* File input for changing profile picture */}
                    <input
                      type="file"
                      accept="image/*"
                      ref={fileInputRef}
                      style={{ display: "none" }}
                      onChange={handleImageChange}
                    />
                  </>
                ) : (
                  <p>Loading user info...</p>
                )}

                {/* Close Button */}
                <button
                  className="close-profile-btn"
                  onClick={() => setShowProfileCard(false)}
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
