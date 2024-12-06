export async function geocodeAddress(fullAddress) {
  const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(fullAddress)}&key=AIzaSyDAjiDOE8glvLdp12DuWoDI82wH_AXfBSI`);
  const data = await response.json();
  if (data.results && data.results.length > 0) {
    const location = data.results[0].geometry.location;
    return { latitude: location.lat, longitude: location.lng };
  } else {
    throw new Error('Unable to find coordinates for the given address');
  }
}