// Seeds the database with your original portfolio content so the site
// isn't empty on first run. Safe to re-run — it upserts by slug/title.
//
// Usage:
//   npm run seed
//
// Make sure MONGODB_URI is set in .env.local before running this.

import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("MONGODB_URI is not set. Add it to .env.local first.");
  process.exit(1);
}

const ProjectSchema = new mongoose.Schema(
  {
    title: String,
    slug: { type: String, unique: true },
    category: String,
    coverImage: String,
    gallery: [String],
    description: String,
    problem: String,
    solution: String,
    techStack: [String],
    liveUrl: String,
    githubUrl: String,
    featured: Boolean,
    order: Number
  },
  { timestamps: true }
);

const ServiceSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    startingPrice: String,
    deliveryTime: String,
    features: [String],
    icon: String,
    featured: Boolean,
    order: Number
  },
  { timestamps: true }
);

const TestimonialSchema = new mongoose.Schema(
  {
    name: String,
    role: String,
    company: String,
    message: String,
    rating: Number,
    featured: Boolean,
    order: Number
  },
  { timestamps: true }
);

const Project = mongoose.model("Project", ProjectSchema);
const Service = mongoose.model("Service", ServiceSchema);
const Testimonial = mongoose.model("Testimonial", TestimonialSchema);

const projects = [
  {
    title: "MediLink",
    slug: "medilink",
    category: "Healthcare",
    coverImage:
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=85",
    gallery: [],
    description:
      "Healthcare booking platform with separate experiences for doctors, patients and admins.",
    problem: "Clinics needed a single system to manage appointments across doctors, patients and staff without juggling spreadsheets or phone calls.",
    solution: "Built role-based dashboards for Admin, Doctor and Patient with real-time appointment booking, achieving sub-100ms response times.",
    techStack: ["Next.js", "TypeScript", "MongoDB", "Express.js", "Tailwind CSS"],
    liveUrl: "https://medilink-doctors.netlify.app/",
    githubUrl: "",
    featured: true,
    order: 1
  },
  {
    title: "Streaming UI",
    slug: "streaming-ui",
    category: "Entertainment",
    coverImage:
      "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1200&q=85",
    gallery: [],
    description: "A cinematic content browsing interface with filtering, discovery and smooth scrolling.",
    problem: "Wanted to explore how streaming platforms deliver a fast, cinematic browsing experience at scale.",
    solution: "Used React Query for caching and infinite scroll, cutting perceived load time by 60%.",
    techStack: ["React", "Firebase", "REST API"],
    liveUrl: "https://netflix-cf98a.web.app/Home",
    githubUrl: "",
    featured: true,
    order: 2
  },
  {
    title: "Snap Grocer",
    slug: "snap-grocer",
    category: "E-commerce",
    coverImage:
      "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=85",
    gallery: [],
    description: "Modern grocery shopping experience with product discovery, search and cart functionality.",
    problem: "Grocery shopping apps often feel cluttered and slow on mobile connections.",
    solution: "Built with Redux Toolkit for predictable state and lazy loading for a snappy mobile-first experience, tested with Jest.",
    techStack: ["React", "Redux Toolkit", "Tailwind CSS", "Jest"],
    liveUrl: "https://snapgrocerr.netlify.app",
    githubUrl: "",
    featured: true,
    order: 3
  }
];

const services = [
  {
    title: "Website Design",
    description: "A clean, responsive marketing website built to convert visitors into leads.",
    startingPrice: "₹5,000",
    deliveryTime: "5–7 days",
    features: ["Responsive design", "Mobile optimization", "SEO basics", "WhatsApp integration"],
    icon: "◆",
    featured: false,
    order: 1
  },
  {
    title: "Full-Stack Web App",
    description: "A complete product with authentication, database and an admin dashboard.",
    startingPrice: "₹18,000",
    deliveryTime: "2–3 weeks",
    features: ["Next.js + MongoDB", "Admin dashboard", "Auth & roles", "API integration"],
    icon: "▲",
    featured: true,
    order: 2
  },
  {
    title: "Ongoing Support",
    description: "Monthly maintenance, small features and fixes for an existing product.",
    startingPrice: "₹3,000/mo",
    deliveryTime: "Ongoing",
    features: ["Bug fixes", "Small feature adds", "Performance checks", "Priority WhatsApp support"],
    icon: "●",
    featured: false,
    order: 3
  }
];

async function run() {
  await mongoose.connect(MONGODB_URI);
  console.log("Connected to MongoDB. Seeding...");

  for (const p of projects) {
    await Project.findOneAndUpdate({ slug: p.slug }, p, { upsert: true, new: true });
    console.log(`  ✔ project: ${p.title}`);
  }

  for (const s of services) {
    await Service.findOneAndUpdate({ title: s.title }, s, { upsert: true, new: true });
    console.log(`  ✔ service: ${s.title}`);
  }

  console.log("\nSeed complete. (No testimonials seeded — add real client feedback via /admin.)");
  await mongoose.disconnect();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
