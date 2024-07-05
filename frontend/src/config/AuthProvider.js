
import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';


const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_PROTOCOL}://${process.env.REACT_APP_DOMAIN}${process.env.REACT_APP_PORT}/verify`,
          {
            withCredentials: true, // This sends the cookies
          }
        );

        if (response.status === 200) {
          const {user} = response.data
          setUser(user);
          console.log(user)
        }
      } catch (error) {
        setUser(null);
      }
    };

    verifyToken();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
