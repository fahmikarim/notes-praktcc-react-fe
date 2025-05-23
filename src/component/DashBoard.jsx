const DashBoard = () => {
  const [token, setToken] = useState("");
  const [expire, setExpire] = useState(0);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);
  const navigate = useNavigate();

  const axiosJWT = axios.create();

  // Function to refresh token
  const refreshToken = useCallback(async () => {
    try {
      const response = await axios.get(`${BASE_URL}/token`, {
        withCredentials: true // This is important for sending cookies
      });
      setToken(response.data.accessToken);
      const decoded = jwtDecode(response.data.accessToken);
      setExpire(decoded.exp);
      return response.data.accessToken;
    } catch (error) {
      console.log("Error refreshing token:", error);
      // Jangan langsung navigate jika ini first load
      if (error.response?.status === 401) {
        navigate("/");
      }
      throw error;
    }
  }, [navigate]);

  axiosJWT.interceptors.request.use(
    async (config) => {
      const currentDate = new Date();

      if (expire * 1000 < currentDate.getTime()) {
        try {
          const newToken = await refreshToken();
          config.headers.Authorization = `Bearer ${newToken}`;
        } catch (error) {
          return Promise.reject(error);
        }
      } else {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  const getNotes = useCallback(async () => {
    try {
      const response = await axiosJWT.get(`${BASE_URL}/notes`);
      setNotes(response.data.data || []);
    } catch (error) {
      console.log("Error getting notes:", error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        navigate("/");
      }
    }
  }, [axiosJWT, navigate]);

  // Initialize token and get notes
  useEffect(() => {
    const initializeDashboard = async () => {
      try {
        console.log("Initializing dashboard...");
        await refreshToken();
        console.log("Token refreshed successfully");
        await getNotes();
        console.log("Notes loaded successfully");
      } catch (error) {
        console.log("Initialization failed:", error);
        // Jika gagal init, redirect ke login
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    initializeDashboard();
  }, []); // Remove dependencies to avoid infinite loop

  const deleteNotes = async (id) => {
    try {
      await axiosJWT.delete(`${BASE_URL}/notes/delete-notes/${id}`);
      getNotes();
    } catch (error) {
      console.log("Error deleting note:", error);
    }
  };

  // Logout function
  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await axios.delete(`${BASE_URL}/logout`, {
        withCredentials: true // Important for sending cookies
      });
      
      // Clear local state
      setToken("");
      setExpire(0);
      setNotes([]);
      
      // Redirect to login page
      navigate("/");
    } catch (error) {
      console.log("Error during logout:", error);
      // Even if logout request fails, still redirect to login
      navigate("/");
    } finally {
      setLoggingOut(false);
    }
  };

  if (loading) {
    return (
      <section className="section">
        <div className="container">
          <div className="has-text-centered">
            <div className="box">
              <p className="title is-4">⏳ Loading...</p>
              <p className="subtitle">Getting your notes ready...</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section>
      <div className="section">
        <div className="container">
          <div className="columns is-centered">
            <div className="column is-10">
              {/* Header with logout button */}
              <div className="level mb-5">
                <div className="level-left">
                  <h1 className="title">📋 Your Notes</h1>
                </div>
                <div className="level-right">
                  <div className="buttons">
                    <Link to="/add-notes" className="button is-success is-light">
                      ➕ Add New Note
                    </Link>
                    <button 
                      onClick={handleLogout}
                      className={`button is-danger is-light ${loggingOut ? 'is-loading' : ''}`}
                      disabled={loggingOut}
                    >
                      🚪 Logout
                    </button>
                  </div>
                </div>
              </div>
              
              <p>Total notes: {notes.length}</p>
              
              {notes.length === 0 ? (
                <div className="box has-text-centered">
                  <p className="title is-5 has-text-grey">📝 No Notes Yet</p>
                  <p className="has-text-grey">
                    You don't have any notes yet. Click "Add New Note" to get started.
                  </p>
                </div>
              ) : (
                <div className="table-container">
                  <table className="table is-striped is-fullwidth is-hoverable">
                    <thead>
                      <tr>
                        <th>No</th>
                        <th>📝 Title</th>
                        <th>🧾 Content</th>
                        <th>📂 Field</th>
                        <th>⚙️ Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {notes.map((note, index) => (
                        <tr key={note.id}>
                          <td>{index + 1}</td>
                          <td>{note.title}</td>
                          <td>{note.content}</td>
                          <td>{note.field}</td>
                          <td>
                            <div className="buttons are-small">
                              <Link to={`/edit/${note.id}`} className="button is-info is-light">
                                ✏️ Edit
                              </Link>
                              <button
                                onClick={() => deleteNotes(note.id)}
                                className="button is-danger is-light"
                              >
                                🗑️ Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DashBoard;
