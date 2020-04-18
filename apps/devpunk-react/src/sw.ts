const register = async () => {
  return new Promise((resolve, reject) => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', function() {
        navigator.serviceWorker
          .register('/service-worker.js')
          .then(registration => {
            resolve(registration);
          })
          .catch(err => {
            reject(err);
          });
      });
    }
  });
};

export { register };
