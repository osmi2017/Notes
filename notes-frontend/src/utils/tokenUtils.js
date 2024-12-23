import API from './../utils/api';

let isRefreshing = false;
let refreshSubscribers = [];

const token = localStorage.getItem('token');


export const isTokenExpired = (token) => {
    if(token){
    const jwtPayload = JSON.parse(atob(token.split('.')[1]));
  const expTimestamp = jwtPayload.exp * 1000; // Convert to milliseconds
  return Date.now() > expTimestamp;
    }else{
        return false
    }
};

const subscribeToRefresh = (callback) => {
    refreshSubscribers.push(callback);
};

const onRefreshed = (newToken) => {
    refreshSubscribers.forEach((callback) => callback(newToken, null));
    refreshSubscribers = [];
};


const getCookie = (name) => {
    let value = '; ' + document.cookie;
    let parts = value.split('; ' + name + '=');
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  };
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refresh_token');
    window.location.href = '/'; // Or use a routing method if you have React Router
  };
  const refresh = localStorage.getItem('refresh_token') 

export const checkAndRefreshToken = async () => {
    
    
    if (!token||isTokenExpired(token)) {
      try {
        
        const csrfToken = getCookie('csrftoken'); 
        
         
                     
        const response = await API.post('/token/refresh/', { "refresh": refresh },{
          
          headers: {
            'X-CSRFToken': csrfToken,
          },
        });
        localStorage.setItem('token', response.data.access);
        localStorage.setItem('refresh_token', response.data.refresh);
      } catch (error) {
        console.error('Error refreshing token:', error);
        
      }
    }
  };

export const ensureValidToken = async () => {

    const token = localStorage.getItem('token');
    
    if (!token || isTokenExpired(token)) {
        if (!isRefreshing) {
            isRefreshing = true;
            try {
                const refresh = localStorage.getItem('refresh_token') 
                if(!refresh){
                  logout()
                }
                const newToken = await checkAndRefreshToken();
                onRefreshed(newToken);
                return newToken;
            } catch (error) {
                throw error;
            } finally {
                isRefreshing = false;
            }
        }

        return new Promise((resolve, reject) => {
            subscribeToRefresh((newToken, error) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(newToken);
                }
            });
        });
    }

    return token;
};
