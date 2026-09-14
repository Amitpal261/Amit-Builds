import { IProject } from "@/models/Project";
import { IService } from "@/models/Service";
import { ITestimonial } from "@/models/Testimonial";
import { ILead } from "@/models/Lead";

const initialProjects: IProject[] = [
  {
    _id: "65e000000000000000000001",
    title: "MediLink",
    slug: "medilink",
    category: "Healthcare",
    coverImage:
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=85",
    gallery: [
      {
        url: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=85",
        size: "wide"
      },
      {
        url: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=1200&q=85",
        size: "small"
      }
    ],
    description:
      "Healthcare booking platform with separate experiences for doctors, patients and admins.",
    problem:
      "Clinics needed a single system to manage appointments across doctors, patients and staff without juggling spreadsheets or phone calls.",
    solution:
      "Built role-based dashboards for Admin, Doctor and Patient with real-time appointment booking, achieving sub-100ms response times.",
    techStack: ["Next.js", "TypeScript", "MongoDB", "Express.js", "Tailwind CSS"],
    liveUrl: "https://medilink-doctors.netlify.app/",
    githubUrl: "",
    featured: true,
    order: 1
  },
  {
    _id: "65e000000000000000000002",
    title: "Streaming UI",
    slug: "streaming-ui",
    category: "Entertainment",
    coverImage:
      "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1200&q=85",
    gallery: [
      {
        url: "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1200&q=85",
        size: "wide"
      }
    ],
    description:
      "A cinematic content browsing interface with filtering, discovery and smooth scrolling.",
    problem:
      "Wanted to explore how streaming platforms deliver a fast, cinematic browsing experience at scale.",
    solution:
      "Used React Query for caching and infinite scroll, cutting perceived load time by 60%.",
    techStack: ["React", "Firebase", "REST API"],
    liveUrl: "https://netflix-cf98a.web.app/Home",
    githubUrl: "",
    featured: true,
    order: 2
  },
  {
    _id: "65e000000000000000000003",
    title: "Snap Grocer",
    slug: "snap-grocer",
    category: "E-commerce",
    coverImage:
      "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=85",
    gallery: [
      {
        url: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=85",
        size: "wide"
      }
    ],
    description:
      "Modern grocery shopping experience with product discovery, search and cart functionality.",
    problem:
      "Grocery shopping apps often feel cluttered and slow on mobile connections.",
    solution:
      "Built with Redux Toolkit for predictable state and lazy loading for a snappy mobile-first experience, tested with Jest.",
    techStack: ["React", "Redux Toolkit", "Tailwind CSS", "Jest"],
    liveUrl: "https://snapgrocerr.netlify.app",
    githubUrl: "",
    featured: true,
    order: 3
  }
];

const initialServices: IService[] = [
  {
    _id: "65e000000000000000000011",
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
    _id: "65e000000000000000000012",
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
    _id: "65e000000000000000000013",
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

const initialTestimonials: ITestimonial[] = [
  {
    _id: "65e000000000000000000021",
    name: "Rajesh Sharma",
    role: "Founder",
    company: "MediCare Health",
    message:
      "Amit delivered our clinic booking system ahead of schedule. The interface is exceptionally clean, fast, and our patients find it intuitive.",
    rating: 5,
    featured: true,
    order: 1
  },
  {
    _id: "65e000000000000000000022",
    name: "Priya Patel",
    role: "Product Lead",
    company: "CineStream",
    message:
      "Working with Amit was effortless. He has a rare blend of frontend artistry, speed, and rock-solid architecture.",
    rating: 5,
    featured: true,
    order: 2
  },
  {
    _id: "65e000000000000000000023",
    name: "Vikram Malhotra",
    role: "Co-Founder",
    company: "GrocerCart",
    message:
      "From mobile optimization to state management, Amit elevated our web app into a high-converting store. Highly recommended.",
    rating: 5,
    featured: true,
    order: 3
  }
];

const initialLeads: ILead[] = [
  {
    _id: "65e000000000000000000031",
    name: "Aarav Gupta",
    email: "aarav@example.com",
    phone: "+91 98765 43210",
    budget: "₹20,000 - ₹50,000",
    message: "Looking to build a custom SaaS landing page and client portal with modern animations.",
    status: "new",
    createdAt: new Date()
  }
];

class MemoryStore {
  private projects: IProject[] = [...initialProjects];
  private services: IService[] = [...initialServices];
  private testimonials: ITestimonial[] = [...initialTestimonials];
  private leads: ILead[] = [...initialLeads];

  // Projects
  getProjects(opts: { featuredOnly?: boolean } = {}): IProject[] {
    const list = opts.featuredOnly ? this.projects.filter((p) => p.featured) : this.projects;
    return [...list].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  }

  getProjectBySlug(slug: string): IProject | null {
    const direct = this.projects.find((p) => p.slug === slug);
    if (direct) return direct;
    const target = slug.toLowerCase().replace(/[-_]/g, "");
    return this.projects.find((p) => p.slug.toLowerCase().replace(/[-_]/g, "") === target) ?? null;
  }

  getProjectById(id: string): IProject | null {
    return this.projects.find((p) => String(p._id) === String(id)) ?? null;
  }

  createProject(data: Partial<IProject>): IProject {
    const newProject: IProject = {
      ...data,
      _id: `proj_${Date.now()}`,
      title: data.title || "Untitled",
      slug: data.slug || `project-${Date.now()}`,
      category: data.category || "General",
      coverImage: data.coverImage || "",
      gallery: data.gallery || [],
      description: data.description || "",
      techStack: data.techStack || [],
      featured: Boolean(data.featured),
      order: Number(data.order || 0),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.projects.push(newProject);
    return newProject;
  }

  updateProject(id: string, data: Partial<IProject>): IProject | null {
    const index = this.projects.findIndex((p) => String(p._id) === String(id));
    if (index === -1) return null;
    this.projects[index] = {
      ...this.projects[index],
      ...data,
      updatedAt: new Date()
    };
    return this.projects[index];
  }

  deleteProject(id: string): boolean {
    const prev = this.projects.length;
    this.projects = this.projects.filter((p) => String(p._id) !== String(id));
    return this.projects.length < prev;
  }

  // Services
  getServices(): IService[] {
    return [...this.services].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  }

  getServiceById(id: string): IService | null {
    return this.services.find((s) => String(s._id) === String(id)) ?? null;
  }

  createService(data: Partial<IService>): IService {
    const newService: IService = {
      ...data,
      _id: `serv_${Date.now()}`,
      title: data.title || "Untitled Service",
      description: data.description || "",
      startingPrice: data.startingPrice || "₹0",
      deliveryTime: data.deliveryTime || "TBD",
      features: data.features || [],
      icon: data.icon || "✦",
      featured: Boolean(data.featured),
      order: Number(data.order || 0),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.services.push(newService);
    return newService;
  }

  updateService(id: string, data: Partial<IService>): IService | null {
    const index = this.services.findIndex((s) => String(s._id) === String(id));
    if (index === -1) return null;
    this.services[index] = {
      ...this.services[index],
      ...data,
      updatedAt: new Date()
    };
    return this.services[index];
  }

  deleteService(id: string): boolean {
    const prev = this.services.length;
    this.services = this.services.filter((s) => String(s._id) !== String(id));
    return this.services.length < prev;
  }

  // Testimonials
  getTestimonials(opts: { featuredOnly?: boolean } = {}): ITestimonial[] {
    const list = opts.featuredOnly ? this.testimonials.filter((t) => t.featured) : this.testimonials;
    return [...list].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  }

  getTestimonialById(id: string): ITestimonial | null {
    return this.testimonials.find((t) => String(t._id) === String(id)) ?? null;
  }

  createTestimonial(data: Partial<ITestimonial>): ITestimonial {
    const newTestimonial: ITestimonial = {
      ...data,
      _id: `test_${Date.now()}`,
      name: data.name || "Anonymous",
      role: data.role || "",
      company: data.company || "",
      message: data.message || "",
      rating: Number(data.rating || 5),
      featured: Boolean(data.featured),
      order: Number(data.order || 0),
      createdAt: new Date()
    };
    this.testimonials.push(newTestimonial);
    return newTestimonial;
  }

  updateTestimonial(id: string, data: Partial<ITestimonial>): ITestimonial | null {
    const index = this.testimonials.findIndex((t) => String(t._id) === String(id));
    if (index === -1) return null;
    this.testimonials[index] = {
      ...this.testimonials[index],
      ...data
    };
    return this.testimonials[index];
  }

  deleteTestimonial(id: string): boolean {
    const prev = this.testimonials.length;
    this.testimonials = this.testimonials.filter((t) => String(t._id) !== String(id));
    return this.testimonials.length < prev;
  }

  // Leads
  getLeads(): ILead[] {
    return [...this.leads].sort(
      (a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
    );
  }

  createLead(data: Partial<ILead>): ILead {
    const newLead: ILead = {
      ...data,
      _id: `lead_${Date.now()}`,
      name: data.name || "Anonymous",
      email: data.email || "",
      phone: data.phone || "",
      budget: data.budget || "",
      message: data.message || "",
      status: "new",
      createdAt: new Date()
    };
    this.leads.unshift(newLead);
    return newLead;
  }

  getCounts() {
    return {
      projectCount: this.projects.length,
      serviceCount: this.services.length,
      testimonialCount: this.testimonials.length,
      newLeads: this.leads.filter((l) => l.status === "new").length
    };
  }
}

// Global singleton for persistence across route calls in the process
declare global {
  // eslint-disable-next-line no-var
  var _memoryStore: MemoryStore | undefined;
}

export const memoryStore = global._memoryStore ?? new MemoryStore();
global._memoryStore = memoryStore;
