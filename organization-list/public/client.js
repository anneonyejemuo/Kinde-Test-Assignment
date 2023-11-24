

import('node-fetch').then((nodeFetch) => {
    const fetch = nodeFetch.default;
  
    
    fetch('/get-organizations')
      .then(function (res) {
        return res.json();
      })
      .then(function (body) {
        // Check for a successful response (status code 200)
        if (body.code === 'OK' && body.message === 'Success' && body.organizations) {
          const organizations = body.organizations;
  
          
          const organizationsList = document.getElementById('organizations-list');
          organizations.forEach((organization) => {
            const listItem = document.createElement('li');
            listItem.classList.add('list-group-item');
            listItem.textContent = organization.name;
            organizationsList.appendChild(listItem);
          });
        } else {
          // Handle error or unexpected response
          console.error('Error fetching organizations:', body);
        }
      })
      .catch(function (error) {
        console.error('Error:', error);
      });
  });
  