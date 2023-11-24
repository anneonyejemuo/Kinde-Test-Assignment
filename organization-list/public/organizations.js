// Fetch organizations and update the HTML
document.addEventListener('DOMContentLoaded', () => {
    // Replace with your actual access token and business name
    const accessToken = 'YOUR_ACCESS_TOKEN';
    const businessName = 'YOUR_BUSINESS_NAME';
  
    const headers = {
      'Accept': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    };
  
    fetch(`https://${businessName}.kinde.com/api/v1/organizations`, {
      method: 'GET',
      headers: headers,
    })
      .then(res => res.json())
      .then(body => {
        if (body.code === 'OK' && body.message === 'Success' && body.organizations) {
          const organizations = body.organizations;
          const organizationsList = document.getElementById('organizations-list');
  
          organizations.forEach(organization => {
            const listItem = document.createElement('li');
            listItem.classList.add('list-group-item');
            listItem.textContent = organization.name;
            organizationsList.appendChild(listItem);
          });
        } else {
          console.error('Error fetching organizations:', body);
        }
      })
      .catch(error => {
        console.error('Error:', error);
      });
  });
  