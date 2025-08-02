import type React from "react";
import './Home.css';
import { useAuth } from "@/contexts/AuthContext";

const Home: React.FC = () => { 
    const { user, logout } = useAuth();

    const handleLogout = (): void => {
        logout();
    }

    const formatDate = (dateString: string): string => {
        try {
            return new Date(dateString).toLocaleDateString();
        } catch (err) {
            return 'N/A';
        }        
    }

    return (
        <div className="home-container">
            <header className="home-header">
                <h1>Welcome to Your Dashboard</h1>
                <button onClick={handleLogout} className="logout-button">
                    Logout
                </button>
            </header>

            <main className="home-content">
                <div className="welcome-card">
                    <h2>Hello, {user?.username}! 👋</h2>
                    <p>You have successfully logged into your account.</p>

                    <div className="user-info">
                        <h3>Your Account Information:</h3>
                        <div className="info-item">
                            <strong>User ID:</strong> {user?.id}
                        </div>
                        <div className="info-item">
                            <strong>Username:</strong> {user?.username}
                        </div>
                        <div className="info-item">
                            <strong>Account Created:</strong> {
                                user?.createdAt ? formatDate(user.createdAt) : 'N/A'
                            }
                        </div>
                    </div>
                </div>

                <div className="features-section">
                    <h3>What you can do here:</h3>
                    <ul className="features-list">
                        <li>✅ You're authenticated with JWT tokens</li>
                        <li>🔒 Your session is secure</li>
                        <li>🚀 Ready for more features!</li>
                        <li>💪 Built with TypeScript for type safety!</li>
                    </ul>
                </div>
            </main>
        </div>
    );
}

export default Home;