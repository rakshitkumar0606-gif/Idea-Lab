// Seeded demo data used when Demo Mode is active. Pure local state, no DB writes.

export type Role = "admin" | "ngo" | "government";
export type DemoTeam = {
  id: string;
  name: string;
  type: "ngo" | "government";
  availability_status: "available" | "busy" | "offline";
  lat: number;
  lng: number;
  location_label: string;
  workload: number;
};
export type DemoDisaster = {
  id: string;
  title: string;
  description: string;
  lat: number;
  lng: number;
  location_label: string;
  severity: "low" | "medium" | "high" | "critical";
  status: "pending" | "in_progress" | "completed";
  created_at: string;
};
export type DemoAssignment = {
  id: string;
  disaster_id: string;
  team_id: string;
  status: "assigned" | "started" | "completed";
  notes: string;
  assigned_at: string;
  started_at?: string;
  completed_at?: string;
};
export type DemoResource = {
  id: string;
  type: string;
  quantity: number;
  lat: number;
  lng: number;
  location_label: string;
};
export type DemoMessage = {
  id: string;
  sender: string;
  sender_role: Role;
  body: string;
  is_broadcast: boolean;
  created_at: string;
};
export type DemoFund = {
  id: string;
  disaster_id: string;
  allocated_amount: number;
  used_amount: number;
  updated_at: string;
};
export type DemoFundTransaction = {
  id: string;
  disaster_id: string;
  amount: number;
  type: "allocated" | "used";
  description: string;
  created_at: string;
};

export const DEMO_TEAMS: DemoTeam[] = [
  {
    "id": "t1",
    "name": "Mumbai Swift Network",
    "type": "ngo",
    "availability_status": "busy",
    "lat": 19.14389772844583,
    "lng": 72.80251543187212,
    "location_label": "Mumbai",
    "workload": 3
  },
  {
    "id": "t2",
    "name": "SDRF Team Varanasi #129",
    "type": "government",
    "availability_status": "available",
    "lat": 25.311935637833274,
    "lng": 82.95019126938993,
    "location_label": "Varanasi",
    "workload": 2
  },
  {
    "id": "t3",
    "name": "District Taskforce Vasai-Virar #587",
    "type": "government",
    "availability_status": "busy",
    "lat": 19.311935637833274,
    "lng": 72.84260854497645,
    "location_label": "Vasai-Virar",
    "workload": 2
  },
  {
    "id": "t4",
    "name": "Kanpur Safe Alliance",
    "type": "ngo",
    "availability_status": "busy",
    "lat": 26.54352816284277,
    "lng": 80.202535773155518,
    "location_label": "Kanpur",
    "workload": 4
  },
  {
    "id": "t5",
    "name": "Police Rescue Mira-Bhayandar #564",
    "type": "government",
    "availability_status": "available",
    "lat": 19.2813,
    "lng": 72.85951543187212,
    "location_label": "Mira-Bhayandar",
    "workload": 2
  },
  {
    "id": "t6",
    "name": "Civil Defense Aligarh #126",
    "type": "government",
    "availability_status": "available",
    "lat": 27.892535773155518,
    "lng": 78.08620854497645,
    "location_label": "Aligarh",
    "workload": 3
  },
  {
    "id": "t7",
    "name": "Ahmedabad Relief squad",
    "type": "ngo",
    "availability_status": "available",
    "lat": 23.0225,
    "lng": 72.5714,
    "location_label": "Ahmedabad",
    "workload": 0
  },
  {
    "id": "t8",
    "name": "Nashik Global Alliance",
    "type": "ngo",
    "availability_status": "busy",
    "lat": 19.95532795418374,
    "lng": 73.80251543187212,
    "location_label": "Nashik",
    "workload": 3
  },
  {
    "id": "t9",
    "name": "Srinagar Fast Team",
    "type": "ngo",
    "availability_status": "available",
    "lat": 34.050191269389934,
    "lng": 74.83614143381415,
    "location_label": "Srinagar",
    "workload": 3
  },
  {
    "id": "t10",
    "name": "NDRF Unit Ranchi #365",
    "type": "government",
    "availability_status": "available",
    "lat": 23.342535773155518,
    "lng": 85.3096,
    "location_label": "Ranchi",
    "workload": 0
  },
  {
    "id": "t11",
    "name": "Madurai Swift Alliance",
    "type": "ngo",
    "availability_status": "busy",
    "lat": 9.942535773155518,
    "lng": 78.14253577315552,
    "location_label": "Madurai",
    "workload": 3
  },
  {
    "id": "t12",
    "name": "Police Rescue Amritsar #787",
    "type": "government",
    "availability_status": "available",
    "lat": 31.62149346618585,
    "lng": 74.86480854497645,
    "location_label": "Amritsar",
    "workload": 2
  },
  {
    "id": "t13",
    "name": "District Taskforce Vadodara #426",
    "type": "government",
    "availability_status": "busy",
    "lat": 22.311935637833274,
    "lng": 73.16519126938993,
    "location_label": "Vadodara",
    "workload": 1
  },
  {
    "id": "t14",
    "name": "State Response Pimpri-Chinchwad #233",
    "type": "government",
    "availability_status": "available",
    "lat": 18.611935637833274,
    "lng": 73.80251543187212,
    "location_label": "Pimpri-Chinchwad",
    "workload": 3
  },
  {
    "id": "t15",
    "name": "Madurai Red Trust",
    "type": "ngo",
    "availability_status": "available",
    "lat": 9.92149346618585,
    "lng": 78.1198,
    "location_label": "Madurai",
    "workload": 1
  },
  {
    "id": "t16",
    "name": "Vasai-Virar Green Foundation",
    "type": "ngo",
    "availability_status": "available",
    "lat": 19.38149346618585,
    "lng": 72.85951543187212,
    "location_label": "Vasai-Virar",
    "workload": 4
  },
  {
    "id": "t17",
    "name": "Police Rescue Bareilly #129",
    "type": "government",
    "availability_status": "available",
    "lat": 28.366687071064047,
    "lng": 79.432535773155518,
    "location_label": "Bareilly",
    "workload": 4
  },
  {
    "id": "t18",
    "name": "NDRF Unit Madurai #865",
    "type": "government",
    "availability_status": "available",
    "lat": 9.9252,
    "lng": 78.1198,
    "location_label": "Madurai",
    "workload": 4
  },
  {
    "id": "t19",
    "name": "Nashik Fast squad",
    "type": "ngo",
    "availability_status": "available",
    "lat": 20.00487508906667,
    "lng": 73.81193563783327,
    "location_label": "Nashik",
    "workload": 0
  },
  {
    "id": "t20",
    "name": "Police Rescue Solapur #362",
    "type": "government",
    "availability_status": "busy",
    "lat": 17.6599,
    "lng": 75.91193563783327,
    "location_label": "Solapur",
    "workload": 2
  },
  {
    "id": "t21",
    "name": "Police Rescue Meerut #787",
    "type": "government",
    "availability_status": "available",
    "lat": 28.98149346618585,
    "lng": 77.71193563783327,
    "location_label": "Meerut",
    "workload": 1
  },
  {
    "id": "t22",
    "name": "Civil Defense Aligarh #126",
    "type": "government",
    "availability_status": "available",
    "lat": 27.892535773155518,
    "lng": 78.08620854497645,
    "location_label": "Aligarh",
    "workload": 1
  },
  {
    "id": "t23",
    "name": "State Response Patna #811",
    "type": "government",
    "availability_status": "busy",
    "lat": 25.58149346618585,
    "lng": 85.15019126938993,
    "location_label": "Patna",
    "workload": 4
  },
  {
    "id": "t24",
    "name": "Civil Defense Allahabad #564",
    "type": "government",
    "availability_status": "available",
    "lat": 25.43851572844583,
    "lng": 81.84260854497645,
    "location_label": "Allahabad",
    "workload": 1
  },
  {
    "id": "t25",
    "name": "Military Engineering Bhopal #875",
    "type": "government",
    "availability_status": "busy",
    "lat": 23.250191269389934,
    "lng": 77.41193563783327,
    "location_label": "Bhopal",
    "workload": 3
  },
  {
    "id": "t26",
    "name": "Kanpur Red squad",
    "type": "ngo",
    "availability_status": "available",
    "lat": 26.43851572844583,
    "lng": 80.336687071064047,
    "location_label": "Kanpur",
    "workload": 4
  },
  {
    "id": "t27",
    "name": "District Taskforce Dhanbad #911",
    "type": "government",
    "availability_status": "available",
    "lat": 23.802535773155518,
    "lng": 86.43614143381415,
    "location_label": "Dhanbad",
    "workload": 0
  },
  {
    "id": "t28",
    "name": "Kalyan-Dombivli Relief Guild",
    "type": "ngo",
    "availability_status": "busy",
    "lat": 19.242555544524087,
    "lng": 73.13614143381415,
    "location_label": "Kalyan-Dombivli",
    "workload": 4
  },
  {
    "id": "t29",
    "name": "Police Rescue Mira-Bhayandar #562",
    "type": "government",
    "availability_status": "available",
    "lat": 19.2813,
    "lng": 72.85951543187212,
    "location_label": "Mira-Bhayandar",
    "workload": 4
  },
  {
    "id": "t30",
    "name": "Srinagar Fast Team",
    "type": "ngo",
    "availability_status": "busy",
    "lat": 34.0837,
    "lng": 74.80251543187212,
    "location_label": "Srinagar",
    "workload": 2
  },
  {
    "id": "t31",
    "name": "Police Rescue Navi Mumbai #126",
    "type": "government",
    "availability_status": "busy",
    "lat": 19.033,
    "lng": 73.02535773155518,
    "location_label": "Navi Mumbai",
    "workload": 2
  },
  {
    "id": "t32",
    "name": "Ahmedabad Fast Group",
    "type": "ngo",
    "availability_status": "available",
    "lat": 23.0225,
    "lng": 72.5714,
    "location_label": "Ahmedabad",
    "workload": 0
  },
  {
    "id": "t33",
    "name": "Kochi Safe Mission",
    "type": "ngo",
    "availability_status": "busy",
    "lat": 9.936687071064047,
    "lng": 76.26519126938993,
    "location_label": "Kochi",
    "workload": 2
  },
  {
    "id": "t34",
    "name": "SDRF Team Varanasi #129",
    "type": "government",
    "availability_status": "available",
    "lat": 25.311935637833274,
    "lng": 82.98620854497645,
    "location_label": "Varanasi",
    "workload": 0
  },
  {
    "id": "t35",
    "name": "Ludhiana Care Foundation",
    "type": "ngo",
    "availability_status": "available",
    "lat": 30.90487508906667,
    "lng": 75.8573,
    "location_label": "Ludhiana",
    "workload": 3
  },
  {
    "id": "t36",
    "name": "Kanpur Fast squad",
    "type": "ngo",
    "availability_status": "busy",
    "lat": 26.4499,
    "lng": 80.3319,
    "location_label": "Kanpur",
    "workload": 1
  },
  {
    "id": "t37",
    "name": "Ahmedabad Golden Group",
    "type": "ngo",
    "availability_status": "available",
    "lat": 23.0225,
    "lng": 72.5714,
    "location_label": "Ahmedabad",
    "workload": 3
  },
  {
    "id": "t38",
    "name": "Madurai Swift Alliance",
    "type": "ngo",
    "availability_status": "available",
    "lat": 9.9252,
    "lng": 78.1198,
    "location_label": "Madurai",
    "workload": 4
  },
  {
    "id": "t39",
    "name": "Vasai-Virar Green Mission",
    "type": "ngo",
    "availability_status": "available",
    "lat": 19.3919,
    "lng": 72.8397,
    "location_label": "Vasai-Virar",
    "workload": 2
  },
  {
    "id": "t40",
    "name": "Lucknow Direct Network",
    "type": "ngo",
    "availability_status": "available",
    "lat": 26.8467,
    "lng": 80.9462,
    "location_label": "Lucknow",
    "workload": 1
  },
  {
    "id": "t41",
    "name": "SDRF Team Bhopal #365",
    "type": "government",
    "availability_status": "available",
    "lat": 23.2599,
    "lng": 77.4126,
    "location_label": "Bhopal",
    "workload": 0
  },
  {
    "id": "t42",
    "name": "Police Rescue Navi Mumbai #564",
    "type": "government",
    "availability_status": "available",
    "lat": 19.033,
    "lng": 73.0297,
    "location_label": "Navi Mumbai",
    "workload": 3
  },
  {
    "id": "t43",
    "name": "Patna Hope Guild",
    "type": "ngo",
    "availability_status": "available",
    "lat": 25.5941,
    "lng": 85.1376,
    "location_label": "Patna",
    "workload": 4
  },
  {
    "id": "t44",
    "name": "Coimbatore Hope Team",
    "type": "ngo",
    "availability_status": "busy",
    "lat": 11.0168,
    "lng": 76.9558,
    "location_label": "Coimbatore",
    "workload": 4
  },
  {
    "id": "t45",
    "name": "Police Rescue Meerut #372",
    "type": "government",
    "availability_status": "busy",
    "lat": 28.9845,
    "lng": 77.7064,
    "location_label": "Meerut",
    "workload": 1
  },
  {
    "id": "t46",
    "name": "Police Rescue Mira-Bhayandar #562",
    "type": "government",
    "availability_status": "busy",
    "lat": 19.2813,
    "lng": 72.8557,
    "location_label": "Mira-Bhayandar",
    "workload": 3
  },
  {
    "id": "t47",
    "name": "Patna Hope Guild",
    "type": "ngo",
    "availability_status": "available",
    "lat": 25.5941,
    "lng": 85.1376,
    "location_label": "Patna",
    "workload": 4
  },
  {
    "id": "t48",
    "name": "Kota Grace Guild",
    "type": "ngo",
    "availability_status": "available",
    "lat": 25.2138,
    "lng": 75.8648,
    "location_label": "Kota",
    "workload": 4
  },
  {
    "id": "t49",
    "name": "Kota Hope Corps",
    "type": "ngo",
    "availability_status": "available",
    "lat": 25.2138,
    "lng": 75.8648,
    "location_label": "Kota",
    "workload": 2
  },
  {
    "id": "t50",
    "name": "Saharanpur Swift Unit",
    "type": "ngo",
    "availability_status": "busy",
    "lat": 29.964,
    "lng": 77.546,
    "location_label": "Saharanpur",
    "workload": 1
  },
  {
    "id": "t51",
    "name": "Civil Defense Ranchi #673",
    "type": "government",
    "availability_status": "available",
    "lat": 23.3441,
    "lng": 85.3096,
    "location_label": "Ranchi",
    "workload": 2
  },
  {
    "id": "t52",
    "name": "Thane Red Group",
    "type": "ngo",
    "availability_status": "available",
    "lat": 19.2183,
    "lng": 72.9781,
    "location_label": "Thane",
    "workload": 2
  },
  {
    "id": "t53",
    "name": "Bareilly Safe Alliance",
    "type": "ngo",
    "availability_status": "available",
    "lat": 28.367,
    "lng": 79.4304,
    "location_label": "Bareilly",
    "workload": 1
  },
  {
    "id": "t54",
    "name": "Police Rescue Mira-Bhayandar #562",
    "type": "government",
    "availability_status": "available",
    "lat": 19.2813,
    "lng": 72.8557,
    "location_label": "Mira-Bhayandar",
    "workload": 1
  },
  {
    "id": "t55",
    "name": "Ahmedabad Relief squad",
    "type": "ngo",
    "availability_status": "busy",
    "lat": 23.0225,
    "lng": 72.5714,
    "location_label": "Ahmedabad",
    "workload": 3
  },
  {
    "id": "t56",
    "name": "Ahmedabad Safe Guild",
    "type": "ngo",
    "availability_status": "busy",
    "lat": 23.0225,
    "lng": 72.5714,
    "location_label": "Ahmedabad",
    "workload": 3
  },
  {
    "id": "t57",
    "name": "Ahmedabad Golden Group",
    "type": "ngo",
    "availability_status": "busy",
    "lat": 23.0225,
    "lng": 72.5714,
    "location_label": "Ahmedabad",
    "workload": 4
  },
  {
    "id": "t58",
    "name": "Nagpur Swift Taskforce",
    "type": "ngo",
    "availability_status": "busy",
    "lat": 21.1458,
    "lng": 79.0882,
    "location_label": "Nagpur",
    "workload": 1
  },
  {
    "id": "t59",
    "name": "District Taskforce Kota #111",
    "type": "government",
    "availability_status": "available",
    "lat": 25.2138,
    "lng": 75.8648,
    "location_label": "Kota",
    "workload": 0
  },
  {
    "id": "t60",
    "name": "Meerut Fast Team",
    "type": "ngo",
    "availability_status": "busy",
    "lat": 28.9845,
    "lng": 77.7064,
    "location_label": "Meerut",
    "workload": 2
  },
  {
    "id": "t61",
    "name": "Varanasi Golden Mission",
    "type": "ngo",
    "availability_status": "available",
    "lat": 25.3176,
    "lng": 82.9739,
    "location_label": "Varanasi",
    "workload": 0
  },
  {
    "id": "t62",
    "name": "SDRF Team Bhopal #642",
    "type": "government",
    "availability_status": "busy",
    "lat": 23.2599,
    "lng": 77.4126,
    "location_label": "Bhopal",
    "workload": 3
  },
  {
    "id": "t63",
    "name": "Police Rescue Mira-Bhayandar #377",
    "type": "government",
    "availability_status": "available",
    "lat": 19.2813,
    "lng": 72.8557,
    "location_label": "Mira-Bhayandar",
    "workload": 2
  },
  {
    "id": "t64",
    "name": "State Response Allahabad #126",
    "type": "government",
    "availability_status": "available",
    "lat": 25.4358,
    "lng": 81.8463,
    "location_label": "Allahabad",
    "workload": 2
  },
  {
    "id": "t65",
    "name": "Lucknow Golden Alliance",
    "type": "ngo",
    "availability_status": "available",
    "lat": 26.8467,
    "lng": 80.9462,
    "location_label": "Lucknow",
    "workload": 3
  },
  {
    "id": "t66",
    "name": "State Response Bareilly #511",
    "type": "government",
    "availability_status": "busy",
    "lat": 28.367,
    "lng": 79.4304,
    "location_label": "Bareilly",
    "workload": 4
  },
  {
    "id": "t67",
    "name": "Police Rescue Navi Mumbai #811",
    "type": "government",
    "availability_status": "busy",
    "lat": 19.033,
    "lng": 73.0297,
    "location_label": "Navi Mumbai",
    "workload": 3
  },
  {
    "id": "t68",
    "name": "SDRF Team Vijayawada #129",
    "type": "government",
    "availability_status": "available",
    "lat": 16.5062,
    "lng": 80.648,
    "location_label": "Vijayawada",
    "workload": 1
  },
  {
    "id": "t69",
    "name": "Police Rescue Mira-Bhayandar #564",
    "type": "government",
    "availability_status": "busy",
    "lat": 19.2813,
    "lng": 72.8557,
    "location_label": "Mira-Bhayandar",
    "workload": 4
  },
  {
    "id": "t70",
    "name": "Ahmedabad Relief squad",
    "type": "ngo",
    "availability_status": "busy",
    "lat": 23.0225,
    "lng": 72.5714,
    "location_label": "Ahmedabad",
    "workload": 4
  },
  {
    "id": "t71",
    "name": "Ranchi Fast squad",
    "type": "ngo",
    "availability_status": "available",
    "lat": 23.3441,
    "lng": 85.3096,
    "location_label": "Ranchi",
    "workload": 3
  },
  {
    "id": "t72",
    "name": "Bhubaneswar Swift Mission",
    "type": "ngo",
    "availability_status": "available",
    "lat": 20.196738307680626,
    "lng": 85.91978034252124,
    "location_label": "Bhubaneswar",
    "workload": 4
  },
  {
    "id": "t73",
    "name": "Tiruppur Grace Network",
    "type": "ngo",
    "availability_status": "available",
    "lat": 11.30212099293319,
    "lng": 77.28601146489518,
    "location_label": "Tiruppur",
    "workload": 3
  },
  {
    "id": "t74",
    "name": "Akola Blue Team",
    "type": "ngo",
    "availability_status": "available",
    "lat": 20.532940598090953,
    "lng": 76.86212527062499,
    "location_label": "Akola",
    "workload": 4
  },
  {
    "id": "t75",
    "name": "Medical Support Mysore #873",
    "type": "government",
    "availability_status": "available",
    "lat": 12.362251068423136,
    "lng": 76.66455925792152,
    "location_label": "Mysore",
    "workload": 3
  },
  {
    "id": "t76",
    "name": "Medical Support Kalyan-Dombivli #362",
    "type": "government",
    "availability_status": "busy",
    "lat": 19.264180362897513,
    "lng": 72.99486017617934,
    "location_label": "Kalyan-Dombivli",
    "workload": 3
  },
  {
    "id": "t77",
    "name": "District Taskforce Vadodara #429",
    "type": "government",
    "availability_status": "available",
    "lat": 22.226739282179675,
    "lng": 73.32418867187965,
    "location_label": "Vadodara",
    "workload": 4
  },
  {
    "id": "t78",
    "name": "Civil Defense Coimbatore #718",
    "type": "government",
    "availability_status": "busy",
    "lat": 10.949245075563855,
    "lng": 77.05395975538403,
    "location_label": "Coimbatore",
    "workload": 0
  },
  {
    "id": "t79",
    "name": "Raipur Relief Foundation",
    "type": "ngo",
    "availability_status": "busy",
    "lat": 21.318865870819362,
    "lng": 81.59453338187532,
    "location_label": "Raipur",
    "workload": 2
  },
  {
    "id": "t80",
    "name": "Police Rescue Kolhapur #607",
    "type": "government",
    "availability_status": "busy",
    "lat": 16.593475202786326,
    "lng": 74.05389754754862,
    "location_label": "Kolhapur",
    "workload": 4
  },
  {
    "id": "t81",
    "name": "SDRF Team Kolhapur #869",
    "type": "government",
    "availability_status": "available",
    "lat": 16.849373283523406,
    "lng": 74.04460519987899,
    "location_label": "Kolhapur",
    "workload": 3
  },
  {
    "id": "t82",
    "name": "Gurgaon Life Unit",
    "type": "ngo",
    "availability_status": "busy",
    "lat": 28.40265579577348,
    "lng": 77.15597642226768,
    "location_label": "Gurgaon",
    "workload": 4
  },
  {
    "id": "t83",
    "name": "SDRF Team Kota #431",
    "type": "government",
    "availability_status": "busy",
    "lat": 25.135365015502018,
    "lng": 76.01008769541188,
    "location_label": "Kota",
    "workload": 4
  },
  {
    "id": "t84",
    "name": "Gulbarga Relief Mission",
    "type": "ngo",
    "availability_status": "busy",
    "lat": 17.21998040663958,
    "lng": 76.84037117923394,
    "location_label": "Gulbarga",
    "workload": 4
  },
  {
    "id": "t100",
    "name": "SDRF Team Aligarh #199",
    "type": "government",
    "availability_status": "available",
    "lat": 27.855892150744133,
    "lng": 78.0049084645663,
    "location_label": "Aligarh",
    "workload": 0
  },
  {
    "id": "t101",
    "name": "Madurai Swift Mission",
    "type": "ngo",
    "availability_status": "available",
    "lat": 10.119367698753166,
    "lng": 78.23172862616963,
    "location_label": "Madurai",
    "workload": 1
  },
  {
    "id": "t102",
    "name": "Medical Support Rajkot #710",
    "type": "government",
    "availability_status": "busy",
    "lat": 22.149517063803003,
    "lng": 70.7607276525107,
    "location_label": "Rajkot",
    "workload": 3
  },
  {
    "id": "t103",
    "name": "State Response Ludhiana #588",
    "type": "government",
    "availability_status": "available",
    "lat": 31.058638317964373,
    "lng": 75.66641595447024,
    "location_label": "Ludhiana",
    "workload": 3
  },
  {
    "id": "t104",
    "name": "Fire Ops Nagpur #443",
    "type": "government",
    "availability_status": "available",
    "lat": 21.049533292196102,
    "lng": 79.23287558846211,
    "location_label": "Nagpur",
    "workload": 2
  },
  {
    "id": "t105",
    "name": "Kochi Grace Alliance",
    "type": "ngo",
    "availability_status": "available",
    "lat": 9.801821717085286,
    "lng": 76.14655927674599,
    "location_label": "Kochi",
    "workload": 1
  },
  {
    "id": "t106",
    "name": "NDRF Unit Vadodara #188",
    "type": "government",
    "availability_status": "busy",
    "lat": 22.37541273402022,
    "lng": 73.10100709994741,
    "location_label": "Vadodara",
    "workload": 1
  },
  {
    "id": "t107",
    "name": "SDRF Team Warangal #546",
    "type": "government",
    "availability_status": "available",
    "lat": 17.918882309874867,
    "lng": 79.52349417135885,
    "location_label": "Warangal",
    "workload": 1
  },
  {
    "id": "t108",
    "name": "Ajmer Care Group",
    "type": "ngo",
    "availability_status": "busy",
    "lat": 26.299055971783574,
    "lng": 74.70005648809075,
    "location_label": "Ajmer",
    "workload": 0
  },
  {
    "id": "t109",
    "name": "Fire Ops Rajkot #449",
    "type": "government",
    "availability_status": "busy",
    "lat": 22.169685393167825,
    "lng": 70.9259386476947,
    "location_label": "Rajkot",
    "workload": 3
  },
  {
    "id": "t110",
    "name": "Nellore Hope Taskforce",
    "type": "ngo",
    "availability_status": "available",
    "lat": 14.608255999481413,
    "lng": 79.91760086292074,
    "location_label": "Nellore",
    "workload": 0
  },
  {
    "id": "t111",
    "name": "SDRF Team Allahabad #548",
    "type": "government",
    "availability_status": "busy",
    "lat": 25.47975817648782,
    "lng": 81.79921645569858,
    "location_label": "Allahabad",
    "workload": 1
  },
  {
    "id": "t112",
    "name": "District Taskforce Moradabad #177",
    "type": "government",
    "availability_status": "busy",
    "lat": 28.79828173904128,
    "lng": 78.79731127569028,
    "location_label": "Moradabad",
    "workload": 0
  },
  {
    "id": "t113",
    "name": "Coimbatore Global Group",
    "type": "ngo",
    "availability_status": "available",
    "lat": 11.157006289630617,
    "lng": 76.95828942589547,
    "location_label": "Coimbatore",
    "workload": 2
  },
  {
    "id": "t114",
    "name": "Rourkela Red Squad",
    "type": "ngo",
    "availability_status": "available",
    "lat": 22.10817339769787,
    "lng": 84.84739641181577,
    "location_label": "Rourkela",
    "workload": 2
  },
  {
    "id": "t115",
    "name": "Military Engineering Chennai #875",
    "type": "government",
    "availability_status": "available",
    "lat": 13.033522212990748,
    "lng": 80.26571622933783,
    "location_label": "Chennai",
    "workload": 3
  },
  {
    "id": "t116",
    "name": "Kota Grace Guild",
    "type": "ngo",
    "availability_status": "available",
    "lat": 25.24321599374355,
    "lng": 76.034154845794,
    "location_label": "Kota",
    "workload": 4
  },
  {
    "id": "t117",
    "name": "Kota Hope Corps",
    "type": "ngo",
    "availability_status": "available",
    "lat": 25.03739133756416,
    "lng": 76.00035526465047,
    "location_label": "Kota",
    "workload": 3
  },
  {
    "id": "t118",
    "name": "Saharanpur Swift Unit",
    "type": "ngo",
    "availability_status": "available",
    "lat": 29.93420677308172,
    "lng": 77.58537250438272,
    "location_label": "Saharanpur",
    "workload": 2
  },
  {
    "id": "t119",
    "name": "Civil Defense Ranchi #673",
    "type": "government",
    "availability_status": "busy",
    "lat": 23.224596737175183,
    "lng": 85.4276480172884,
    "location_label": "Ranchi",
    "workload": 2
  },
  {
    "id": "t120",
    "name": "Thane Red Group",
    "type": "ngo",
    "availability_status": "available",
    "lat": 19.135980307137956,
    "lng": 72.79731768374296,
    "location_label": "Thane",
    "workload": 2
  }
];

export const DEMO_DISASTERS: DemoDisaster[] = [
  { id: "d1", title: "Cyclone Vayu Landfall", description: "Severe cyclonic storm hitting coastal area, evacuation in progress.", lat: 13.0827, lng: 80.2707, location_label: "Chennai Coast", severity: "critical", status: "in_progress", created_at: new Date(Date.now() - 86400000 * 2).toISOString() },
  { id: "d2", title: "Flash Flood — Yamuna", description: "River Yamuna overflowing, low-lying areas inundated.", lat: 28.6139, lng: 77.2090, location_label: "New Delhi", severity: "high", status: "pending", created_at: new Date(Date.now() - 3600000 * 4).toISOString() },
  { id: "d3", title: "Landslide on NH-22", description: "Major highway blocked due to landslide, vehicles stranded.", lat: 31.1048, lng: 77.1734, location_label: "Shimla Region", severity: "high", status: "in_progress", created_at: new Date(Date.now() - 86400000).toISOString() },
  { id: "d4", title: "Industrial Fire", description: "Fire at chemical plant, toxic fume risk.", lat: 19.0760, lng: 72.8777, location_label: "Mumbai Industrial Area", severity: "medium", status: "completed", created_at: new Date(Date.now() - 86400000 * 5).toISOString() },
  { id: "d5", title: "Earthquake Aftershock", description: "Magnitude 5.2 aftershock; structural assessments needed.", lat: 26.8467, lng: 80.9462, location_label: "Lucknow", severity: "medium", status: "pending", created_at: new Date(Date.now() - 3600000 * 12).toISOString() },
  { id: "d6", title: "Heatwave Alert", description: "Extreme temperatures forecast, public health advisory active.", lat: 23.0225, lng: 72.5714, location_label: "Ahmedabad", severity: "high", status: "pending", created_at: new Date(Date.now() - 3600000 * 2).toISOString() },
  { id: "d7", title: "Brahmaputra Level Alert", description: "Water levels crossing danger mark, flood risk in low areas.", lat: 26.1445, lng: 91.7362, location_label: "Guwahati", severity: "medium", status: "in_progress", created_at: new Date(Date.now() - 3600000 * 8).toISOString() },
  { id: "d8", title: "Urban Flood", description: "Severe waterlogging due to intense rainfall.", lat: 17.3850, lng: 78.4867, location_label: "Hyderabad", severity: "medium", status: "pending", created_at: new Date(Date.now() - 3600000 * 5).toISOString() },
];

export const DEMO_ASSIGNMENTS: DemoAssignment[] = [
  { id: "a1", disaster_id: "d1", team_id: "t2", status: "started", notes: "Coastal evac led by Capt. Rao", assigned_at: new Date(Date.now() - 86400000 * 2).toISOString(), started_at: new Date(Date.now() - 86400000).toISOString() },
  { id: "a2", disaster_id: "d1", team_id: "t6", status: "started", notes: "Medical triage at relief camp", assigned_at: new Date(Date.now() - 86400000 * 2).toISOString(), started_at: new Date(Date.now() - 86400000 * 1.5).toISOString() },
  { id: "a3", disaster_id: "d3", team_id: "t4", status: "assigned", notes: "Reach site within 6 hrs", assigned_at: new Date(Date.now() - 3600000 * 8).toISOString() },
  { id: "a4", disaster_id: "d4", team_id: "t3", status: "completed", notes: "Containment achieved", assigned_at: new Date(Date.now() - 86400000 * 5).toISOString(), started_at: new Date(Date.now() - 86400000 * 5).toISOString(), completed_at: new Date(Date.now() - 86400000 * 4).toISOString() },
  { id: "a5", disaster_id: "d7", team_id: "t10", status: "started", notes: "Monitoring embankments", assigned_at: new Date(Date.now() - 3600000 * 6).toISOString(), started_at: new Date(Date.now() - 3600000 * 4).toISOString() },
  { id: "a6", disaster_id: "d6", team_id: "t8", status: "assigned", notes: "Heatwave response coordination", assigned_at: new Date(Date.now() - 3600000 * 1).toISOString() },
  // Demo assignments for preview - visible to demo NGO team
  { id: "a7", disaster_id: "d2", team_id: "t1", status: "assigned", notes: "Provide medical support and rescue coordination at affected areas", assigned_at: new Date(Date.now() - 3600000 * 3).toISOString() },
  { id: "a8", disaster_id: "d8", team_id: "t1", status: "started", notes: "Water pumping and evacuation in progress", assigned_at: new Date(Date.now() - 3600000 * 6).toISOString(), started_at: new Date(Date.now() - 3600000 * 2).toISOString() },
  // Demo assignments for preview - visible to demo Government team
  { id: "a9", disaster_id: "d5", team_id: "t2", status: "assigned", notes: "Structural assessment and damage survey required", assigned_at: new Date(Date.now() - 3600000 * 10).toISOString() },
  { id: "a10", disaster_id: "d2", team_id: "t2", status: "completed", notes: "Preliminary dam inspection completed successfully", assigned_at: new Date(Date.now() - 86400000 * 1).toISOString(), started_at: new Date(Date.now() - 3600000 * 12).toISOString(), completed_at: new Date(Date.now() - 3600000 * 3).toISOString() },
];

export const DEMO_RESOURCES: DemoResource[] = [
  { id: "r1", type: "Food Packets", quantity: 2400, lat: 28.6139, lng: 77.2090, location_label: "Delhi Depot" },
  { id: "r2", type: "Medical Kits", quantity: 320, lat: 19.0760, lng: 72.8777, location_label: "Mumbai Stockpile" },
  { id: "r3", type: "Tents", quantity: 180, lat: 13.0827, lng: 80.2707, location_label: "Chennai Forward Base" },
  { id: "r4", type: "Drinking Water (L)", quantity: 12000, lat: 22.5726, lng: 88.3639, location_label: "Kolkata Warehouse" },
  { id: "r5", type: "Rescue Boats", quantity: 24, lat: 26.1445, lng: 91.7362, location_label: "Guwahati Hub" },
  { id: "r6", type: "Blankets", quantity: 5000, lat: 34.0837, lng: 74.7973, location_label: "Srinagar Base" },
  { id: "r7", type: "Ambulances", quantity: 12, lat: 17.3850, lng: 78.4867, location_label: "Hyderabad Medical Center" },
  { id: "r8", type: "Solar Lanterns", quantity: 1500, lat: 9.9312, lng: 76.2673, location_label: "Kochi Forward Supply" },
  { id: "r9", type: "Food Packets", quantity: 1200, lat: 28.6139, lng: 77.2090, location_label: "Delhi Depot" },
  { id: "r10", type: "Medical Kits", quantity: 150, lat: 19.0760, lng: 72.8777, location_label: "Mumbai Stockpile" },
];

export const DEMO_FUNDS: DemoFund[] = [
  { id: "f1", disaster_id: "d1", allocated_amount: 500000, used_amount: 320000, updated_at: new Date().toISOString() },
  { id: "f2", disaster_id: "d2", allocated_amount: 250000, used_amount: 50000, updated_at: new Date().toISOString() },
  { id: "f3", disaster_id: "d3", allocated_amount: 150000, used_amount: 120000, updated_at: new Date().toISOString() },
];

export const DEMO_TRANSACTIONS: DemoFundTransaction[] = [
  { id: "ft1", disaster_id: "d1", amount: 500000, type: "allocated", description: "Initial emergency response allocation", created_at: new Date(Date.now() - 86400000 * 2).toISOString() },
  { id: "ft2", disaster_id: "d1", amount: 200000, type: "used", description: "Relief supplies procurement", created_at: new Date(Date.now() - 86400000).toISOString() },
  { id: "ft3", disaster_id: "d1", amount: 120000, type: "used", description: "Logistics and transport fees", created_at: new Date(Date.now() - 3600000 * 4).toISOString() },
  { id: "ft4", disaster_id: "d2", amount: 250000, type: "allocated", description: "Flood relief initialization", created_at: new Date(Date.now() - 3600000 * 12).toISOString() },
];

export const DEMO_MESSAGES: DemoMessage[] = [
  { id: "m1", sender: "Central Command", sender_role: "admin", body: "All teams report status hourly until further notice.", is_broadcast: true, created_at: new Date(Date.now() - 3600000 * 3).toISOString() },
  { id: "m2", sender: "Coastal Relief Corps", sender_role: "ngo", body: "Camp Bravo operational. ~400 evacuees received.", is_broadcast: false, created_at: new Date(Date.now() - 3600000 * 2).toISOString() },
  { id: "m3", sender: "NDRF Battalion 8", sender_role: "government", body: "Awaiting assignment for Yamuna flood response.", is_broadcast: false, created_at: new Date(Date.now() - 3600000).toISOString() },
];
