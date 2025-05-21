const { db } = require('../config/firebase');

// Create Plane (no seats added here)
exports.createPlane = async (req, res) => {
  const { name, rows, columns } = req.body;

  if (!name || !rows || !columns) {
    return res.status(400).json({ error: "Name, rows, and columns are required." });
  }

//remove this and make it a drop down in frontend
//   if (rows < 4 || rows > 10 || columns < 6|| columns > 8) {
//     return res.status(400).json({ error: "Rows must be 4-10 and columns 6-8." });
//   }

  try {
    const planeRef = await db.collection("planes").add({
      name,
      rows,
      columns,
      createdAt: new Date(),
    });

    res.status(201).json({ message: "Plane created", planeId: planeRef.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getPlanes = async (req, res) => {
  try {
    const snapshot = await db.collection("planes").get();
    const planes = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(planes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getPlaneById = async (req, res) => {
  try {
    const planeDoc = await db.collection("planes").doc(req.params.id).get();
    if (!planeDoc.exists) return res.status(404).json({ error: "Plane not found" });
    res.json({ id: planeDoc.id, ...planeDoc.data() });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updatePlane = async (req, res) => {
  try {
    await db.collection("planes").doc(req.params.id).update(req.body);
    res.json({ message: "Plane updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deletePlane = async (req, res) => {
  try {
    await db.collection("planes").doc(req.params.id).delete();
    res.json({ message: "Plane deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
