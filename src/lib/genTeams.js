
const cities = [
    { name: "Mumbai", lat: 19.0760, lng: 72.8777 },
    { name: "Delhi", lat: 28.6139, lng: 77.2090 },
    { name: "Bengaluru", lat: 12.9716, lng: 77.5946 },
    { name: "Hyderabad", lat: 17.3850, lng: 78.4867 },
    { name: "Ahmedabad", lat: 23.0225, lng: 72.5714 },
    { name: "Chennai", lat: 13.0827, lng: 80.2707 },
    { name: "Kolkata", lat: 22.5726, lng: 88.3639 },
    { name: "Pune", lat: 18.5204, lng: 73.8567 },
    { name: "Jaipur", lat: 26.9124, lng: 75.7873 },
    { name: "Lucknow", lat: 26.8467, lng: 80.9462 },
    { name: "Kanpur", lat: 26.4499, lng: 80.3319 },
    { name: "Nagpur", lat: 21.1458, lng: 79.0882 },
    { name: "Indore", lat: 22.7196, lng: 75.8577 },
    { name: "Thane", lat: 19.2183, lng: 72.9781 },
    { name: "Bhopal", lat: 23.2599, lng: 77.4126 },
    { name: "Visakhapatnam", lat: 17.6868, lng: 83.2185 },
    { name: "Pimpri-Chinchwad", lat: 18.6298, lng: 73.7997 },
    { name: "Patna", lat: 25.5941, lng: 85.1376 },
    { name: "Vadodara", lat: 22.3072, lng: 73.1812 },
    { name: "Ghaziabad", lat: 28.6692, lng: 77.4538 },
    { name: "Ludhiana", lat: 30.9010, lng: 75.8573 },
    { name: "Agra", lat: 27.1767, lng: 78.0081 },
    { name: "Nashik", lat: 19.9975, lng: 73.7898 },
    { name: "Faridabad", lat: 28.4089, lng: 77.3178 },
    { name: "Meerut", lat: 28.9845, lng: 77.7064 },
    { name: "Rajkot", lat: 22.3039, lng: 70.8022 },
    { name: "Kalyan-Dombivli", lat: 19.2437, lng: 73.1350 },
    { name: "Vasai-Virar", lat: 19.3919, lng: 72.8397 },
    { name: "Varanasi", lat: 25.3176, lng: 82.9739 },
    { name: "Srinagar", lat: 34.0837, lng: 74.7973 },
    { name: "Aurangabad", lat: 19.8762, lng: 75.3433 },
    { name: "Dhanbad", lat: 23.7957, lng: 86.4304 },
    { name: "Amritsar", lat: 31.6340, lng: 74.8723 },
    { name: "Navi Mumbai", lat: 19.0330, lng: 73.0297 },
    { name: "Allahabad", lat: 25.4358, lng: 81.8463 },
    { name: "Ranchi", lat: 23.3441, lng: 85.3096 },
    { name: "Howrah", lat: 22.5958, lng: 88.2636 },
    { name: "Coimbatore", lat: 11.0168, lng: 76.9558 },
    { name: "Jabalpur", lat: 23.1815, lng: 79.9864 },
    { name: "Gwalior", lat: 26.2124, lng: 78.1772 },
    { name: "Vijayawada", lat: 16.5062, lng: 80.6480 },
    { name: "Jodhpur", lat: 26.2389, lng: 73.0243 },
    { name: "Madurai", lat: 9.9252, lng: 78.1198 },
    { name: "Raipur", lat: 21.2514, lng: 81.6296 },
    { name: "Kota", lat: 25.2138, lng: 75.8648 },
    { name: "Chandigarh", lat: 30.7333, lng: 76.7794 },
    { name: "Guwahati", lat: 26.1445, lng: 91.7362 },
    { name: "Solapur", lat: 17.6599, lng: 75.9064 },
    { name: "Hubli-Dharwad", lat: 15.3647, lng: 75.1240 },
    { name: "Tiruchirappalli", lat: 10.7905, lng: 78.7047 },
    { name: "Bareilly", lat: 28.3670, lng: 79.4304 },
    { name: "Moradabad", lat: 28.8351, lng: 78.7733 },
    { name: "Mysore", lat: 12.2958, lng: 76.6394 },
    { name: "Tiruppur", lat: 11.1085, lng: 77.3411 },
    { name: "Gurgaon", lat: 28.4595, lng: 77.0266 },
    { name: "Aligarh", lat: 27.8974, lng: 78.0880 },
    { name: "Jalandhar", lat: 31.3260, lng: 75.5762 },
    { name: "Bhubaneswar", lat: 20.2961, lng: 85.8245 },
    { name: "Salem", lat: 11.6643, lng: 78.1460 },
    { name: "Mira-Bhayandar", lat: 19.2813, lng: 72.8557 },
    { name: "Warangal", lat: 17.9689, lng: 79.5941 },
    { name: "Guntur", lat: 16.3067, lng: 80.4365 },
    { name: "Bhiwandi", lat: 19.2813, lng: 73.0483 },
    { name: "Saharanpur", lat: 29.9640, lng: 77.5460 },
    { name: "Gorakhpur", lat: 26.7606, lng: 83.3732 },
    { name: "Bikaner", lat: 28.0229, lng: 73.3119 },
    { name: "Amravati", lat: 20.9320, lng: 77.7523 },
    { name: "Noida", lat: 28.5355, lng: 77.3910 },
    { name: "Jamshedpur", lat: 22.8046, lng: 86.2029 },
    { name: "Bhilai", lat: 21.1938, lng: 81.3509 },
    { name: "Cuttack", lat: 20.4625, lng: 85.8830 },
    { name: "Firozabad", lat: 27.1511, lng: 78.3953 },
    { name: "Kochi", lat: 9.9312, lng: 76.2673 },
    { name: "Nellore", lat: 14.4426, lng: 79.9865 },
    { name: "Bhavnagar", lat: 21.7645, lng: 72.1519 },
    { name: "Dehradun", lat: 30.3165, lng: 78.0322 },
    { name: "Durgapur", lat: 23.4807, lng: 87.3204 },
    { name: "Asansol", lat: 23.6739, lng: 86.9524 },
    { name: "Rourkela", lat: 22.2604, lng: 84.8536 },
    { name: "Nanded", lat: 19.1628, lng: 77.3183 },
    { name: "Kolhapur", lat: 16.7050, lng: 74.2433 },
    { name: "Ajmer", lat: 26.4499, lng: 74.6399 },
    { name: "Akola", lat: 20.7002, lng: 77.0082 },
    { name: "Gulbarga", lat: 17.3297, lng: 76.8343 }
];

const ngoPrefixes = ["Relief", "Hope", "Care", "Rescue", "Life", "Unity", "Swift", "Grace", "Global", "Direct", "Safe", "Fast", "Green", "Blue", "Red", "Golden"];
const ngoSuffixes = ["Network", "Corps", "Squad", "Group", "Mission", "Foundation", "Trust", "Alliance", "Unit", "Team", "Taskforce", "Guild"];
const govtPrefixes = ["NDRF Unit", "SDRF Team", "State Response", "District Taskforce", "Civil Defense", "Medical Support", "Military Engineering", "Police Rescue", "Fire Ops"];

const teams = [];

for (let i = 1; i <= 200; i++) {
    const city = cities[Math.floor(Math.random() * cities.length)];
    const type = Math.random() > 0.5 ? "government" : "ngo";
    const status = Math.random() > 0.3 ? "available" : "busy";
    let name = "";
    
    if (type === "ngo") {
        const p = ngoPrefixes[Math.floor(Math.random() * ngoPrefixes.length)];
        const s = ngoSuffixes[Math.floor(Math.random() * ngoSuffixes.length)];
        name = `${city.name} ${p} ${s}`;
    } else {
        const p = govtPrefixes[Math.floor(Math.random() * govtPrefixes.length)];
        name = `${p} ${city.name} #${Math.floor(Math.random() * 900) + 100}`;
    }
    
    teams.push({
        id: `t${i}`,
        name: name,
        type: type,
        availability_status: status,
        lat: city.lat + (Math.random() - 0.5) * 0.4,
        lng: city.lng + (Math.random() - 0.5) * 0.4,
        location_label: city.name,
        workload: Math.floor(Math.random() * 5)
    });
}

console.log(JSON.stringify(teams, null, 2));
