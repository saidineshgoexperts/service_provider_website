const base = 'https://api.doorstephub.com/';
const applianceUrl = 'https://api.doorstephub.com/v1/dhubApi/app/applience-repairs-website/';
const userUrl = 'https://api.doorstephub.com/v1/dhubApi/app/user/';

export const urls = {
  baseurl: base,
  
  // Appliance repair services
  getServicesBySubcategory: applianceUrl + 'services_by_subcategory',
  getServiceDetails: applianceUrl + 'dhub_service_details',
  GetPopularService: applianceUrl + 'featured_service_centers',
  
  // User profile endpoints (FIXED - use userUrl, not Url)
  fetchUserProfile: userUrl + 'profile',
  updateUserProfile: userUrl + 'profile',
};
