export const users = [
  {
    id: 1,
    name: "Youssef Alami",
    email: "youssef@click2print.ma",
    password: "123456",
    role: "admin",
    solde: 2000,
    avatar: "YA"
  },
  {
    id: 2,
    name: "Sara Benjelloun",
    email: "sara@click2print.ma",
    password: "123456",
    role: "client",
    solde: 500,
    avatar: "SB"
  },
  {
    id: 3,
    name: "Karim Idrissi",
    email: "karim@click2print.ma",
    password: "123456",
    role: "operator",
    solde: 800,
    avatar: "KI"
  }
];

export const materials = [
  { id: 1, name: "PLA",    price: 50,  color: "#10b981" },
  { id: 2, name: "PETG",   price: 70,  color: "#3b82f6" },
  { id: 3, name: "ABS",    price: 65,  color: "#f59e0b" },
  { id: 4, name: "Résine", price: 120, color: "#8b5cf6" },
];

export const colors = [
  "Blanc", "Noir", "Gris", "Bleu", "Rouge", "Vert", "Jaune"
];

export const machines = [
  { id: 1, name: "Ender 3 Pro #01", type: "FDM", status: "idle",     progress: 0,  materials: ["PLA", "PETG"] },
  { id: 2, name: "Bambu X1 #02",    type: "FDM", status: "printing", progress: 65, materials: ["PLA", "PETG", "ABS"] },
  { id: 3, name: "Prusa MK4 #03",   type: "FDM", status: "error",    progress: 0,  materials: ["PLA", "ABS"] },
  { id: 4, name: "Elegoo Saturn",   type: "SLA", status: "idle",     progress: 0,  materials: ["Résine"] },
];

export const initialOrders = [
  {
    id: 1,
    userId: 2,
    fileName: "bracket_v3.stl",
    material: "PLA",
    color: "Blanc",
    quantity: 2,
    price: 100,
    status: "printing",
    machineId: 2,
    date: "2026-04-20"
  },
  {
    id: 2,
    userId: 2,
    fileName: "coque_phone.stl",
    material: "PETG",
    color: "Noir",
    quantity: 1,
    price: 70,
    status: "done",
    machineId: null,
    date: "2026-04-19"
  },
  {
    id: 3,
    userId: 3,
    fileName: "engrenage.stl",
    material: "ABS",
    color: "Gris",
    quantity: 3,
    price: 195,
    status: "pending",
    machineId: null,
    date: "2026-04-21"
  }
];