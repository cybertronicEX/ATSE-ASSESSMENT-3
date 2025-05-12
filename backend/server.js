const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger/swaggerConfig');

const authRoutes = require('./routes/authRoutes');
// const projectCharterRoutes = require('./routes/projectCharterRoutes');
// const settingsRoutes = require("./routes/settingsRoutes");
// const dashboardRoutes = require("./routes/dashboardRoutes");


require('./config/firebase'); // Firebase config

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Swagger docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/api/auth', authRoutes);
// app.use("/api/project-charter", projectCharterRoutes);
// app.use("/api/settings", settingsRoutes);
// app.use("/api/dashboard", dashboardRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Swagger docs: http://localhost:${PORT}/api-docs`);
});
