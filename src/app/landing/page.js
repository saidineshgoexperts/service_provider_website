// "use client";

// import { useState, useEffect, useRef } from "react";
// import Image from "next/image";
// import {
//   ThemeProvider,
//   createTheme,
//   Box,
//   Container,
//   Typography,
//   Button,
//   Stack,
//   Card,
//   CardContent,
//   Grid,
//   AppBar,
//   Toolbar,
//   IconButton,
//   Chip,
//   Paper,
// } from "@mui/material";
// import {
//   Sparkles,
//   Zap,
//   Shield,
//   Clock,
//   Star,
//   ArrowRight,
//   Menu,
// } from "lucide-react";

// // MUI Theme
// const theme = createTheme({
//   palette: {
//     mode: "dark",
//     primary: {
//       main: "#8B5CF6",
//     },
//     secondary: {
//       main: "#EC4899",
//     },
//     background: {
//       default: "#000000",
//       paper: "rgba(255, 255, 255, 0.05)",
//     },
//   },
//   typography: {
//     fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
//     h1: {
//       fontWeight: 900,
//       fontSize: "4.5rem",
//       lineHeight: 1.1,
//       letterSpacing: "-0.02em",
//     },
//     h2: {
//       fontWeight: 900,
//       fontSize: "3.5rem",
//       lineHeight: 1.2,
//     },
//     h3: {
//       fontWeight: 900,
//       fontSize: "2.5rem",
//     },
//     h4: {
//       fontWeight: 800,
//       fontSize: "2rem",
//     },
//   },
//   shape: {
//     borderRadius: 24,
//   },
// });

// // Services Data
// const SERVICES = [
//   {
//     id: 1,
//     title: "Appliance Wizardry",
//     subtitle: "Smart Home Tech Repair",
//     description: "AI-powered diagnostics for instant appliance fixes",
//     gradient: "linear-gradient(135deg, #8B5CF6 0%, #A78BFA 50%, #EC4899 100%)",
//     image: "https://images.pexels.com/photos/3825581/pexels-photo-3825581.jpeg",
//     icon: "⚡",
//     stats: "2K+ Fixed",
//   },
//   {
//     id: 2,
//     title: "Daily Essentials",
//     subtitle: "Quantum Grocery Delivery",
//     description: "Fresh groceries teleported to your doorstep in 15 mins",
//     gradient: "linear-gradient(135deg, #10B981 0%, #14B8A6 50%, #06B6D4 100%)",
//     image: "https://images.pexels.com/photos/1860208/pexels-photo-1860208.jpeg",
//     icon: "🛒",
//     stats: "10K+ Orders",
//   },
//   {
//     id: 3,
//     title: "MediVault",
//     subtitle: "Prescription On-Demand",
//     description: "Blockchain-verified medicine delivery with zero errors",
//     gradient: "linear-gradient(135deg, #2563EB 0%, #6366F1 50%, #8B5CF6 100%)",
//     image: "https://images.pexels.com/photos/3606233/pexels-photo-3606233.jpeg",
//     icon: "💊",
//     stats: "5K+ Delivered",
//   },
//   {
//     id: 4,
//     title: "Smart Hostels",
//     subtitle: "AI-Matched Living Spaces",
//     description: "Find your perfect PG with personality matching algorithms",
//     gradient: "linear-gradient(135deg, #D97706 0%, #F59E0B 50%, #EF4444 100%)",
//     image: "https://images.pexels.com/photos/259580/pexels-photo-259580.jpeg",
//     icon: "🏠",
//     stats: "1K+ Matched",
//   },
//   {
//     id: 5,
//     title: "Divine Connect",
//     subtitle: "Virtual Spiritual Services",
//     description: "Sacred rituals and pujas delivered with AR/VR experiences",
//     gradient: "linear-gradient(135deg, #EAB308 0%, #F59E0B 50%, #F97316 100%)",
//     image: "https://images.pexels.com/photos/179907/pexels-photo-179907.jpeg",
//     icon: "🕉️",
//     stats: "500+ Rituals",
//   },
//   {
//     id: 6,
//     title: "Glow Station",
//     subtitle: "Mobile Beauty Labs",
//     description: "Celebrity stylists arrive at your doorstep with pro kits",
//     gradient: "linear-gradient(135deg, #DB2777 0%, #EC4899 50%, #EF4444 100%)",
//     image: "https://images.pexels.com/photos/3738341/pexels-photo-3738341.jpeg",
//     icon: "💅",
//     stats: "3K+ Glowed",
//   },
// ];

// const FEATURES = [
//   { icon: Zap, text: "Instant Booking", color: "#FBBF24" },
//   { icon: Shield, text: "100% Verified", color: "#10B981" },
//   { icon: Clock, text: "24/7 Support", color: "#3B82F6" },
//   { icon: Star, text: "Premium Quality", color: "#A78BFA" },
// ];

// export default function RevolutionaryLanding() {
//   const [activeService, setActiveService] = useState(0);
//   const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
//   const canvasRef = useRef(null);

//   // Animated gradient background
//   useEffect(() => {
//     const canvas = canvasRef.current;
//     if (!canvas) return;

//     const ctx = canvas.getContext("2d");
//     if (!ctx) return;

//     canvas.width = window.innerWidth;
//     canvas.height = window.innerHeight;

//     let animationId;
//     let time = 0;

//     const animate = () => {
//       time += 0.005;

//       const gradient = ctx.createRadialGradient(
//         canvas.width / 2 + Math.sin(time) * 200,
//         canvas.height / 2 + Math.cos(time) * 200,
//         0,
//         canvas.width / 2,
//         canvas.height / 2,
//         canvas.width
//       );

//       gradient.addColorStop(0, `rgba(139, 92, 246, ${0.1 + Math.sin(time) * 0.05})`);
//       gradient.addColorStop(0.5, `rgba(59, 130, 246, ${0.05 + Math.cos(time) * 0.03})`);
//       gradient.addColorStop(1, "rgba(16, 185, 129, 0.02)");

//       ctx.fillStyle = gradient;
//       ctx.fillRect(0, 0, canvas.width, canvas.height);

//       animationId = requestAnimationFrame(animate);
//     };

//     animate();

//     return () => cancelAnimationFrame(animationId);
//   }, []);

//   // Mouse tracking
//   useEffect(() => {
//     const handleMouseMove = (e) => {
//       setMousePosition({ x: e.clientX, y: e.clientY });
//     };
//     window.addEventListener("mousemove", handleMouseMove);
//     return () => window.removeEventListener("mousemove", handleMouseMove);
//   }, []);

//   // Auto-rotate services
//   useEffect(() => {
//     const interval = setInterval(() => {
//       setActiveService((prev) => (prev + 1) % SERVICES.length);
//     }, 4000);
//     return () => clearInterval(interval);
//   }, []);

//   const currentService = SERVICES[activeService];

//   return (
//     <ThemeProvider theme={theme}>
//       <Box sx={{ position: "relative", minHeight: "100vh", bgcolor: "background.default", overflow: "hidden" }}>
//         {/* Animated Canvas Background */}
//         <canvas
//           ref={canvasRef}
//           style={{
//             position: "fixed",
//             inset: 0,
//             pointerEvents: "none",
//             opacity: 0.4,
//           }}
//         />

//         {/* Custom Cursor */}
//         <Box
//           sx={{
//             position: "fixed",
//             pointerEvents: "none",
//             zIndex: 9999,
//             mixBlendMode: "difference",
//             transition: "transform 0.1s",
//             left: mousePosition.x - 10,
//             top: mousePosition.y - 10,
//             display: { xs: "none", md: "block" },
//           }}
//         >
//           <Box
//             sx={{
//               width: 20,
//               height: 20,
//               border: "2px solid white",
//               borderRadius: "50%",
//             }}
//           />
//         </Box>

//         {/* Floating Navigation */}
//         <AppBar
//           position="fixed"
//           elevation={0}
//           sx={{
//             top: 24,
//             left: "50%",
//             transform: "translateX(-50%)",
//             width: { xs: "95%", md: "90%" },
//             maxWidth: 1200,
//             bgcolor: "rgba(255, 255, 255, 0.05)",
//             backdropFilter: "blur(40px)",
//             border: "1px solid rgba(255, 255, 255, 0.1)",
//             borderRadius: 999,
//           }}
//         >
//           <Toolbar sx={{ py: 1 }}>
//             <Stack direction="row" alignItems="center" spacing={1.5} sx={{ flexGrow: 1 }}>
//               <Box
//                 sx={{
//                   width: 40,
//                   height: 40,
//                   borderRadius: "50%",
//                   background: "linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)",
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "center",
//                   fontWeight: 900,
//                   fontSize: 18,
//                 }}
//               >
//                 D
//               </Box>
//               <Typography
//                 variant="h6"
//                 sx={{
//                   fontWeight: 900,
//                   background: "linear-gradient(135deg, #A78BFA 0%, #EC4899 100%)",
//                   WebkitBackgroundClip: "text",
//                   WebkitTextFillColor: "transparent",
//                   display: { xs: "none", sm: "block" },
//                 }}
//               >
//                 DoorStep Nexus
//               </Typography>
//             </Stack>

//             <Stack direction="row" spacing={{ xs: 1, md: 4 }} sx={{ display: { xs: "none", md: "flex" } }}>
//               {["Services", "Tech", "About"].map((item) => (
//                 <Button key={item} sx={{ color: "rgba(255,255,255,0.7)", fontWeight: 600, fontSize: 14 }}>
//                   {item}
//                 </Button>
//               ))}
//             </Stack>

//             <Button
//               variant="contained"
//               sx={{
//                 ml: 2,
//                 borderRadius: 999,
//                 background: "linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)",
//                 fontWeight: 700,
//                 px: 3,
//                 boxShadow: "0 8px 32px rgba(139, 92, 246, 0.3)",
//                 "&:hover": {
//                   boxShadow: "0 12px 40px rgba(139, 92, 246, 0.5)",
//                 },
//               }}
//             >
//               Launch App
//             </Button>
//           </Toolbar>
//         </AppBar>

//         {/* Hero Section */}
//         <Box sx={{ pt: { xs: 16, md: 20 }, pb: { xs: 10, md: 15 }, px: 3 }}>
//           <Container maxWidth="lg">
//             <Grid container spacing={8} alignItems="center">
//               {/* Left Content */}
//               <Grid item xs={12} md={6}>
//                 <Stack spacing={4}>
//                   <Chip
//                     icon={<Sparkles size={16} color="#A78BFA" />}
//                     label="Powered by Quantum AI"
//                     sx={{
//                       bgcolor: "rgba(139, 92, 246, 0.1)",
//                       border: "1px solid rgba(139, 92, 246, 0.2)",
//                       color: "#C4B5FD",
//                       fontWeight: 600,
//                       alignSelf: "flex-start",
//                     }}
//                   />

//                   <Box>
//                     <Typography variant="h1" sx={{ fontSize: { xs: "3rem", md: "4.5rem" } }}>
//                       <span
//                         style={{
//                           background: "linear-gradient(135deg, #FFFFFF 0%, #A78BFA 50%, #F5D0FE 100%)",
//                           WebkitBackgroundClip: "text",
//                           WebkitTextFillColor: "transparent",
//                         }}
//                       >
//                         The Future
//                       </span>
//                       <br />
//                       <span style={{ color: "#FFF" }}>of Services</span>
//                       <br />
//                       <span
//                         style={{
//                           background: "linear-gradient(135deg, #A78BFA 0%, #EC4899 50%, #FCA5A5 100%)",
//                           WebkitBackgroundClip: "text",
//                           WebkitTextFillColor: "transparent",
//                         }}
//                       >
//                         Is Here
//                       </span>
//                     </Typography>
//                   </Box>

//                   <Typography variant="h6" sx={{ color: "rgba(255,255,255,0.6)", fontWeight: 400, maxWidth: 500 }}>
//                     Experience hyper-speed delivery, AI-powered matching, and blockchain-verified quality. Welcome to
//                     the next dimension of convenience.
//                   </Typography>

//                   <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
//                     <Button
//                       variant="contained"
//                       size="large"
//                       endIcon={<ArrowRight size={20} />}
//                       sx={{
//                         borderRadius: 4,
//                         py: 2,
//                         px: 4,
//                         background: "linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)",
//                         fontWeight: 700,
//                         fontSize: 16,
//                         boxShadow: "0 12px 40px rgba(139, 92, 246, 0.4)",
//                       }}
//                     >
//                       Explore Services
//                     </Button>
//                     <Button
//                       variant="outlined"
//                       size="large"
//                       sx={{
//                         borderRadius: 4,
//                         py: 2,
//                         px: 4,
//                         borderColor: "rgba(255,255,255,0.1)",
//                         color: "#FFF",
//                         fontWeight: 700,
//                         fontSize: 16,
//                         "&:hover": {
//                           bgcolor: "rgba(255,255,255,0.05)",
//                           borderColor: "rgba(255,255,255,0.2)",
//                         },
//                       }}
//                     >
//                       Watch Demo
//                     </Button>
//                   </Stack>

//                   {/* Feature Pills */}
//                   <Stack direction="row" spacing={1.5} flexWrap="wrap" sx={{ pt: 2 }}>
//                     {FEATURES.map((feature, i) => (
//                       <Chip
//                         key={i}
//                         icon={<feature.icon size={16} color={feature.color} />}
//                         label={feature.text}
//                         sx={{
//                           bgcolor: "rgba(255,255,255,0.05)",
//                           border: "1px solid rgba(255,255,255,0.1)",
//                           color: "rgba(255,255,255,0.8)",
//                           fontWeight: 600,
//                         }}
//                       />
//                     ))}
//                   </Stack>
//                 </Stack>
//               </Grid>

//               {/* Right - 3D Floating Service Card */}
//               <Grid item xs={12} md={6}>
//                 <Box sx={{ position: "relative", height: { xs: 500, md: 600 } }}>
//                   <Box
//                     sx={{
//                       position: "absolute",
//                       inset: 0,
//                       transition: "all 0.7s ease-out",
//                       transform: {
//                         xs: "none",
//                         md: `perspective(1000px) rotateY(${
//                           (mousePosition.x - (typeof window !== "undefined" ? window.innerWidth : 0) / 2) / 50
//                         }deg) rotateX(${
//                           -(mousePosition.y - (typeof window !== "undefined" ? window.innerHeight : 0) / 2) / 50
//                         }deg)`,
//                       },
//                     }}
//                   >
//                     {/* Glow Effect */}
//                     <Box
//                       sx={{
//                         position: "absolute",
//                         inset: 0,
//                         background: currentService.gradient,
//                         borderRadius: 10,
//                         opacity: 0.2,
//                         filter: "blur(60px)",
//                       }}
//                     />

//                     {/* Card */}
//                     <Card
//                       sx={{
//                         position: "relative",
//                         height: "100%",
//                         background: "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)",
//                         backdropFilter: "blur(40px)",
//                         border: "1px solid rgba(255,255,255,0.2)",
//                         borderRadius: 10,
//                         p: 4,
//                         boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
//                       }}
//                     >
//                       {/* Service Icon */}
//                       <Box
//                         sx={{
//                           position: "absolute",
//                           top: -24,
//                           right: -24,
//                           width: 96,
//                           height: 96,
//                           background: "linear-gradient(135deg, #FFF 0%, rgba(255,255,255,0.8) 100%)",
//                           borderRadius: 6,
//                           display: "flex",
//                           alignItems: "center",
//                           justifyContent: "center",
//                           fontSize: 48,
//                           boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
//                           transform: "rotate(12deg)",
//                         }}
//                       >
//                         {currentService.icon}
//                       </Box>

//                       <CardContent sx={{ height: "100%", p: 0, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
//                         <Box>
//                           <Chip
//                             label={currentService.stats}
//                             size="small"
//                             sx={{
//                               bgcolor: "rgba(255,255,255,0.1)",
//                               color: "rgba(255,255,255,0.8)",
//                               fontWeight: 700,
//                               mb: 2,
//                             }}
//                           />

//                           <Typography variant="h3" sx={{ mb: 1, fontSize: { xs: "2rem", md: "2.5rem" } }}>
//                             {currentService.title}
//                           </Typography>
//                           <Typography variant="h6" sx={{ color: "rgba(255,255,255,0.7)", mb: 2 }}>
//                             {currentService.subtitle}
//                           </Typography>
//                           <Typography sx={{ color: "rgba(255,255,255,0.6)" }}>{currentService.description}</Typography>
//                         </Box>

//                         {/* Service Image */}
//                         <Box
//                           sx={{
//                             position: "relative",
//                             height: 250,
//                             borderRadius: 6,
//                             overflow: "hidden",
//                             mt: 3,
//                             boxShadow: "0 12px 32px rgba(0,0,0,0.3)",
//                           }}
//                         >
//                           <Image src={currentService.image} alt={currentService.title} fill style={{ objectFit: "cover" }} priority />
//                           <Box
//                             sx={{
//                               position: "absolute",
//                               inset: 0,
//                               background: currentService.gradient,
//                               opacity: 0.4,
//                               mixBlendMode: "multiply",
//                             }}
//                           />
//                         </Box>
//                       </CardContent>
//                     </Card>
//                   </Box>
//                 </Box>

//                 {/* Service Navigation Dots */}
//                 <Stack direction="row" spacing={1.5} justifyContent="center" sx={{ mt: 4 }}>
//                   {SERVICES.map((_, i) => (
//                     <Box
//                       key={i}
//                       onClick={() => setActiveService(i)}
//                       sx={{
//                         width: i === activeService ? 48 : 12,
//                         height: 12,
//                         borderRadius: 999,
//                         background:
//                           i === activeService
//                             ? "linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)"
//                             : "rgba(255,255,255,0.2)",
//                         cursor: "pointer",
//                         transition: "all 0.3s",
//                         "&:hover": {
//                           background: i === activeService ? undefined : "rgba(255,255,255,0.4)",
//                         },
//                       }}
//                     />
//                   ))}
//                 </Stack>
//               </Grid>
//             </Grid>
//           </Container>
//         </Box>

//         {/* All Services Grid - Bento Style */}
//         <Box sx={{ py: { xs: 10, md: 16 }, px: 3 }}>
//           <Container maxWidth="lg">
//             <Box sx={{ textAlign: "center", mb: 10 }}>
//               <Typography variant="h2" sx={{ mb: 3, fontSize: { xs: "2.5rem", md: "3.5rem" } }}>
//                 <span
//                   style={{
//                     background: "linear-gradient(135deg, #A78BFA 0%, #EC4899 100%)",
//                     WebkitBackgroundClip: "text",
//                     WebkitTextFillColor: "transparent",
//                   }}
//                 >
//                   Six Quantum Services
//                 </span>
//               </Typography>
//               <Typography variant="h6" sx={{ color: "rgba(255,255,255,0.6)", maxWidth: 700, mx: "auto" }}>
//                 Each service engineered with cutting-edge AI and delivered at light speed
//               </Typography>
//             </Box>

//             {/* Bento Grid */}
//             <Grid container spacing={3}>
//               {SERVICES.map((service, i) => (
//                 <Grid item xs={12} md={i === 0 || i === 5 ? 8 : 4} key={service.id}>
//                   <Card
//                     sx={{
//                       position: "relative",
//                       height: i === 0 || i === 5 ? 500 : 240,
//                       borderRadius: 6,
//                       overflow: "hidden",
//                       cursor: "pointer",
//                       transition: "transform 0.3s",
//                       "&:hover": {
//                         transform: "translateY(-8px)",
//                         "& .hover-overlay": {
//                           opacity: 1,
//                         },
//                         "& .service-image": {
//                           transform: "scale(1.1)",
//                         },
//                       },
//                     }}
//                   >
//                     {/* Background Image */}
//                     <Box sx={{ position: "absolute", inset: 0 }}>
//                       <Image
//                         src={service.image}
//                         alt={service.title}
//                         fill
//                         className="service-image"
//                         style={{ objectFit: "cover", transition: "transform 0.7s" }}
//                       />
//                       <Box sx={{ position: "absolute", inset: 0, background: service.gradient, opacity: 0.8, mixBlendMode: "multiply" }} />
//                       <Box sx={{ position: "absolute", inset: 0, bgcolor: "rgba(0,0,0,0.4)" }} />
//                     </Box>

//                     {/* Glass Overlay */}
//                     <Box
//                       className="hover-overlay"
//                       sx={{
//                         position: "absolute",
//                         inset: 0,
//                         background: "linear-gradient(180deg, rgba(255,255,255,0.05) 0%, rgba(0,0,0,0.6) 100%)",
//                         backdropFilter: "blur(8px)",
//                         opacity: 0,
//                         transition: "opacity 0.5s",
//                       }}
//                     />

//                     {/* Content */}
//                     <CardContent
//                       sx={{
//                         position: "relative",
//                         height: "100%",
//                         display: "flex",
//                         flexDirection: "column",
//                         justifyContent: "space-between",
//                         p: 4,
//                       }}
//                     >
//                       <Box>
//                         <Typography sx={{ fontSize: 48, mb: 2, transition: "transform 0.5s" }}>{service.icon}</Typography>
//                         <Typography variant="h4" sx={{ mb: 1, fontSize: { xs: "1.5rem", md: "2rem" } }}>
//                           {service.title}
//                         </Typography>
//                         <Typography variant="subtitle1" sx={{ color: "rgba(255,255,255,0.9)", fontWeight: 600, mb: 1 }}>
//                           {service.subtitle}
//                         </Typography>
//                         <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.7)", maxWidth: 400 }}>
//                           {service.description}
//                         </Typography>
//                       </Box>

//                       <Stack direction="row" alignItems="center" justifyContent="space-between">
//                         <Chip
//                           label={service.stats}
//                           size="small"
//                           sx={{
//                             bgcolor: "rgba(255,255,255,0.2)",
//                             backdropFilter: "blur(8px)",
//                             color: "#FFF",
//                             fontWeight: 700,
//                           }}
//                         />
//                         <ArrowRight size={24} style={{ opacity: 0, transition: "all 0.5s" }} className="arrow-icon" />
//                       </Stack>
//                     </CardContent>
//                   </Card>
//                 </Grid>
//               ))}
//             </Grid>
//           </Container>
//         </Box>

//         {/* CTA Section */}
//         <Box sx={{ py: { xs: 10, md: 16 }, px: 3 }}>
//           <Container maxWidth="md">
//             <Box sx={{ position: "relative" }}>
//               {/* Glow Effect */}
//               <Box
//                 sx={{
//                   position: "absolute",
//                   inset: 0,
//                   background: "linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)",
//                   borderRadius: 12,
//                   filter: "blur(60px)",
//                   opacity: 0.3,
//                 }}
//               />

//               {/* CTA Card */}
//               <Paper
//                 sx={{
//                   position: "relative",
//                   background: "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)",
//                   backdropFilter: "blur(40px)",
//                   border: "1px solid rgba(255,255,255,0.2)",
//                   borderRadius: 12,
//                   p: { xs: 6, md: 10 },
//                   textAlign: "center",
//                 }}
//               >
//                 <Typography variant="h2" sx={{ mb: 3, fontSize: { xs: "2.5rem", md: "3.5rem" } }}>
//                   Ready to Experience
//                   <br />
//                   <span
//                     style={{
//                       background: "linear-gradient(135deg, #A78BFA 0%, #EC4899 100%)",
//                       WebkitBackgroundClip: "text",
//                       WebkitTextFillColor: "transparent",
//                     }}
//                   >
//                     The Future?
//                   </span>
//                 </Typography>
//                 <Typography variant="h6" sx={{ color: "rgba(255,255,255,0.6)", mb: 6, maxWidth: 600, mx: "auto" }}>
//                   Join 50,000+ users already living in tomorrow
//                 </Typography>
//                 <Button
//                   variant="contained"
//                   size="large"
//                   endIcon={
//                     <Box
//                       sx={{
//                         width: 32,
//                         height: 32,
//                         bgcolor: "rgba(255,255,255,0.2)",
//                         borderRadius: "50%",
//                         display: "flex",
//                         alignItems: "center",
//                         justifyContent: "center",
//                       }}
//                     >
//                       <ArrowRight size={20} />
//                     </Box>
//                   }
//                   sx={{
//                     borderRadius: 999,
//                     py: 2.5,
//                     px: 6,
//                     background: "linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)",
//                     fontWeight: 900,
//                     fontSize: 18,
//                     boxShadow: "0 16px 48px rgba(139, 92, 246, 0.4)",
//                   }}
//                 >
//                   Get Started Now
//                 </Button>
//               </Paper>
//             </Box>
//           </Container>
//         </Box>

//         {/* Footer */}
//         <Box sx={{ py: 6, px: 3, borderTop: "1px solid rgba(255,255,255,0.1)" }}>
//           <Container maxWidth="lg">
//             <Typography variant="body2" sx={{ textAlign: "center", color: "rgba(255,255,255,0.4)" }}>
//               © 2026 DoorStep Nexus. Engineered for Tomorrow.
//             </Typography>
//           </Container>
//         </Box>
//       </Box>
//     </ThemeProvider>
//   );
// }






"use client";

import { useState } from "react";
import Image from "next/image";
import {
  ThemeProvider,
  createTheme,
  Box,
  Container,
  Typography,
  Button,
  Stack,
  Card,
  CardContent,
  Grid,
  AppBar,
  Toolbar,
  IconButton,
  Chip,
} from "@mui/material";
import {
  Home,
  ShoppingBag,
  LocalHospital,
  Build,
  Apartment,
  Spa,
  Menu,
  ArrowForward,
  CheckCircle,
  Star,
} from "@mui/icons-material";

// Your Custom Theme
const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
      light: "#42a5f5",
      dark: "#1565c0",
    },
    secondary: {
      main: "#9c27b0",
      light: "#ba68c8",
      dark: "#7b1fa2",
    },
    background: {
      default: "#fafafa",
      paper: "#ffffff",
    },
  },
  typography: {
    fontFamily: 'var(--font-poppins), -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 600,
    },
    button: {
      textTransform: "none",
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: "10px 24px",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        },
      },
    },
  },
});

// Services Data
const SERVICES = [
  {
    id: 1,
    title: "Appliance Service",
    description: "Expert repairs for all home appliances",
    image: "https://images.pexels.com/photos/3825581/pexels-photo-3825581.jpeg",
    icon: Build,
    color: "#1976d2",
  },
  {
    id: 2,
    title: "Daily Needs",
    description: "Fresh groceries delivered daily",
    image: "https://images.pexels.com/photos/1860208/pexels-photo-1860208.jpeg",
    icon: ShoppingBag,
    color: "#42a5f5",
  },
  {
    id: 3,
    title: "Medicine Delivery",
    description: "Pharmacy at your doorstep",
    image: "https://images.pexels.com/photos/3606233/pexels-photo-3606233.jpeg",
    icon: LocalHospital,
    color: "#9c27b0",
  },
  {
    id: 4,
    title: "PG Hostels",
    description: "Verified accommodation options",
    image: "https://images.pexels.com/photos/259580/pexels-photo-259580.jpeg",
    icon: Apartment,
    color: "#ba68c8",
  },
  {
    id: 5,
    title: "Religious Services",
    description: "Spiritual and ritual services",
    image: "https://images.pexels.com/photos/179907/pexels-photo-179907.jpeg",
    icon: Home,
    color: "#1565c0",
  },
  {
    id: 6,
    title: "Spa & Salon",
    description: "Professional beauty services",
    image: "https://images.pexels.com/photos/3738341/pexels-photo-3738341.jpeg",
    icon: Spa,
    color: "#7b1fa2",
  },
];

const FEATURES = ["24/7 Support", "Verified Professionals", "Instant Booking", "Secure Payments"];

export default function UniqueLanding() {
  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ bgcolor: "background.default", minHeight: "100vh" }}>
        {/* Navigation */}
        <AppBar position="sticky" elevation={0} sx={{ bgcolor: "white", borderBottom: "1px solid #e0e0e0" }}>
          <Toolbar sx={{ py: 1 }}>
            <Typography variant="h6" sx={{ flexGrow: 1, color: "primary.main", fontWeight: 700 }}>
              DoorStep Hub
            </Typography>
            <Stack direction="row" spacing={3} sx={{ display: { xs: "none", md: "flex" } }}>
              <Button sx={{ color: "text.primary" }}>Services</Button>
              <Button sx={{ color: "text.primary" }}>About</Button>
              <Button sx={{ color: "text.primary" }}>Contact</Button>
            </Stack>
            <Button variant="contained" sx={{ ml: 3 }}>
              Get Started
            </Button>
            <IconButton sx={{ ml: 1, display: { xs: "flex", md: "none" } }}>
              <Menu />
            </IconButton>
          </Toolbar>
        </AppBar>

        {/* Hero Section */}
        <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: "white" }}>
          <Container maxWidth="lg">
            <Grid container spacing={6} alignItems="center">
              <Grid item xs={12} md={6}>
                <Stack spacing={3}>
                  <Chip
                    icon={<Star sx={{ fontSize: 16 }} />}
                    label="Trusted by 10,000+ customers"
                    size="small"
                    sx={{
                      bgcolor: "primary.light",
                      color: "white",
                      fontWeight: 600,
                      width: "fit-content",
                    }}
                  />
                  <Typography variant="h1" sx={{ fontSize: { xs: "2.5rem", md: "3.5rem" }, lineHeight: 1.2 }}>
                    Everything You Need,{" "}
                    <Box component="span" sx={{ color: "primary.main" }}>
                      Delivered
                    </Box>
                  </Typography>
                  <Typography variant="h6" sx={{ color: "text.secondary", fontWeight: 400, lineHeight: 1.7 }}>
                    Professional services at your doorstep. From home repairs to daily essentials, we've got you
                    covered.
                  </Typography>
                  <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ pt: 2 }}>
                    <Button variant="contained" size="large" endIcon={<ArrowForward />}>
                      Explore Services
                    </Button>
                    <Button variant="outlined" size="large">
                      Learn More
                    </Button>
                  </Stack>
                </Stack>
              </Grid>

              <Grid item xs={12} md={6}>
                <Box
                  sx={{
                    position: "relative",
                    height: { xs: 400, md: 500 },
                    borderRadius: 3,
                    overflow: "hidden",
                    boxShadow: "0 8px 32px rgba(25, 118, 210, 0.15)",
                  }}
                >
                  <Image
                    src="https://images.pexels.com/photos/4391470/pexels-photo-4391470.jpeg"
                    alt="Delivery Service"
                    fill
                    style={{ objectFit: "cover" }}
                    priority
                  />
                </Box>
              </Grid>
            </Grid>
          </Container>
        </Box>

        {/* Features Bar */}
        <Box sx={{ py: 3, bgcolor: "primary.main" }}>
          <Container maxWidth="lg">
            <Grid container spacing={2}>
              {FEATURES.map((feature, index) => (
                <Grid item xs={6} md={3} key={index}>
                  <Stack direction="row" spacing={1} alignItems="center" justifyContent="center">
                    <CheckCircle sx={{ color: "white", fontSize: 18 }} />
                    <Typography sx={{ color: "white", fontWeight: 500, fontSize: { xs: 13, md: 15 } }}>
                      {feature}
                    </Typography>
                  </Stack>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>

        {/* Services Grid - UNIQUE CARD DESIGN */}
        <Box sx={{ py: { xs: 8, md: 12 } }}>
          <Container maxWidth="lg">
            <Box sx={{ textAlign: "center", mb: 8 }}>
              <Typography variant="h2" sx={{ mb: 2, fontSize: { xs: "2rem", md: "2.5rem" } }}>
                Our Services
              </Typography>
              <Typography variant="body1" sx={{ color: "text.secondary", maxWidth: 600, mx: "auto" }}>
                Professional services designed to make your life easier
              </Typography>
            </Box>

            <Grid container spacing={3}>
              {SERVICES.map((service, index) => (
                <Grid item xs={12} sm={6} md={4} key={service.id}>
                  {/* UNIQUE ASYMMETRIC CARD DESIGN */}
                  <Card
                    sx={{
                      position: "relative",
                      overflow: "visible",
                      transition: "all 0.3s ease",
                      cursor: "pointer",
                      border: "1px solid #f0f0f0",
                      "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: "0 12px 24px rgba(25, 118, 210, 0.12)",
                        "& .icon-box": {
                          transform: "rotate(-5deg) scale(1.1)",
                        },
                        "& .image-box": {
                          transform: "scale(1.05)",
                        },
                      },
                    }}
                  >
                    {/* Colored Top Border */}
                    <Box
                      sx={{
                        height: 4,
                        bgcolor: service.color,
                        borderRadius: "12px 12px 0 0",
                      }}
                    />

                    <CardContent sx={{ p: 0 }}>
                      {/* Image Section with Diagonal Cut */}
                      <Box
                        sx={{
                          position: "relative",
                          height: 160,
                          overflow: "hidden",
                          clipPath: index % 2 === 0 ? "polygon(0 0, 100% 0, 100% 85%, 0 100%)" : "polygon(0 0, 100% 0, 100% 100%, 0 85%)",
                        }}
                      >
                        <Box
                          className="image-box"
                          sx={{
                            position: "relative",
                            height: "100%",
                            transition: "transform 0.3s ease",
                          }}
                        >
                          <Image src={service.image} alt={service.title} fill style={{ objectFit: "cover" }} />
                          <Box
                            sx={{
                              position: "absolute",
                              inset: 0,
                              bgcolor: service.color,
                              opacity: 0.08,
                            }}
                          />
                        </Box>
                      </Box>

                      {/* Content Section */}
                      <Box sx={{ p: 3, pt: 2 }}>
                        {/* Floating Icon Badge */}
                        <Box
                          className="icon-box"
                          sx={{
                            position: "absolute",
                            top: 140,
                            right: 20,
                            width: 56,
                            height: 56,
                            borderRadius: "14px",
                            bgcolor: "white",
                            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            border: `2px solid ${service.color}`,
                            transition: "all 0.3s ease",
                          }}
                        >
                          <service.icon sx={{ color: service.color, fontSize: 28 }} />
                        </Box>

                        <Typography
                          variant="h6"
                          sx={{
                            mb: 1,
                            fontWeight: 600,
                            color: "text.primary",
                            pr: 7,
                          }}
                        >
                          {service.title}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: "text.secondary",
                            lineHeight: 1.6,
                            mb: 2,
                          }}
                        >
                          {service.description}
                        </Typography>

                        {/* Bottom Accent Line */}
                        <Box
                          sx={{
                            width: 40,
                            height: 3,
                            bgcolor: service.color,
                            borderRadius: 2,
                            opacity: 0.6,
                          }}
                        />
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>

        {/* CTA Section */}
        <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: "white" }}>
          <Container maxWidth="md">
            <Box
              sx={{
                p: { xs: 6, md: 8 },
                textAlign: "center",
                bgcolor: "rgba(25, 118, 210, 0.04)",
                border: "2px solid",
                borderColor: "primary.main",
                borderRadius: 3,
              }}
            >
              <Typography variant="h2" sx={{ mb: 3, fontSize: { xs: "2rem", md: "2.5rem" } }}>
                Ready to Get Started?
              </Typography>
              <Typography variant="body1" sx={{ color: "text.secondary", mb: 4, fontSize: 18 }}>
                Join thousands of satisfied customers today
              </Typography>
              <Button variant="contained" size="large" endIcon={<ArrowForward />} sx={{ px: 4, py: 1.5 }}>
                Book Your First Service
              </Button>
            </Box>
          </Container>
        </Box>

        {/* Footer */}
        <Box sx={{ py: 4, bgcolor: "#f5f5f5", borderTop: "1px solid #e0e0e0" }}>
          <Container maxWidth="lg">
            <Grid container spacing={4}>
              <Grid item xs={12} md={4}>
                <Typography variant="h6" sx={{ color: "primary.main", fontWeight: 700, mb: 2 }}>
                  DoorStep Hub
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  Your trusted partner for on-demand services
                </Typography>
              </Grid>
              <Grid item xs={6} md={2}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
                  Company
                </Typography>
                <Stack spacing={1}>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    About Us
                  </Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    Careers
                  </Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    Blog
                  </Typography>
                </Stack>
              </Grid>
              <Grid item xs={6} md={2}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
                  Support
                </Typography>
                <Stack spacing={1}>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    Help Center
                  </Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    Contact Us
                  </Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    FAQ
                  </Typography>
                </Stack>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
                  Subscribe to Updates
                </Typography>
                <Stack direction="row" spacing={1}>
                  <Box
                    component="input"
                    placeholder="Enter email"
                    sx={{
                      flex: 1,
                      px: 2,
                      py: 1.5,
                      border: "1px solid #e0e0e0",
                      borderRadius: 1,
                      outline: "none",
                      fontSize: 14,
                      fontFamily: "inherit",
                      "&:focus": {
                        borderColor: "primary.main",
                      },
                    }}
                  />
                  <Button variant="contained">Subscribe</Button>
                </Stack>
              </Grid>
            </Grid>
            <Box sx={{ mt: 4, pt: 3, borderTop: "1px solid #e0e0e0", textAlign: "center" }}>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                © 2026 DoorStep Hub. All rights reserved.
              </Typography>
            </Box>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
