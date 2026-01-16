import Container from "@/components/Container";
import { useEffect, useRef, Suspense, useState } from "react";
import styles from "@/styles/Home.module.css";
import { Button } from "@/components/ui/button";
import {
  ChevronRight,
  Code2,
  Frame,
  SearchCheck,
  Eye,
  MonitorSmartphone,
  FileText,
} from "lucide-react";
import { TriangleDownIcon } from "@radix-ui/react-icons";
import dynamic from "next/dynamic";
import Link from "next/link";
import { cn, scrollTo } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";

// Lazy load heavy components
const Spline = dynamic(() => import("@splinetool/react-spline"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-primary/5 rounded-3xl">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
    </div>
  ),
});

const aboutStats = [
  { label: "Years of experience", value: "1+" },
  { label: "Technologies mastered", value: "5+" },
];

const projects = [
  {
    title: "AI Financer",
    description: "AI-powered financial management platform",
    image: "/assets/ai-flnancer.webm",
    href: "https://ai-financer-zbbp.vercel.app/",
  },
  {
    title: "Netflix-GPT",
    description: "A clone of Netflix using React, Next.js, Tailwind CSS, and TypeScript, with a GPT-4 powered chat interface for movie recommendations",
    image: "/assets/netflix-gpt.webm",
    href: "https://netflix-gpt-silk-three.vercel.app/",
  },
  {
    title: "Food Vila",
    description: "Modern food delivery and ordering system",
    image: "/assets/food-vila.webm",
    href: "https://food-villa-lovat.vercel.app/",
  },
];



const services = [
  {
    service: "Frontend Development",
    description:
      "Creating stellar user interfaces and web experiences using the latest technologies.",
    icon: Code2,
  },
  {
    service: "UX Design",
    description:
      "Building intuitive, user-centric designs that drive engagement and conversion.",
    icon: Frame,
  },
  {
    service: "SEO Optimization",
    description:
      "Enhancing your website's visibility in search engines for increased organic traffic.",
    icon: SearchCheck,
  },
  {
    service: "Responsive Design",
    description:
      "Designing websites that look and perform equally well on all devices and screen sizes.",
    icon: MonitorSmartphone,
  },
  {
    service: "Backend Development",
    description:
      "Developing robust, scalable server-side logic for a wide range of web applications.",
    icon: Eye,
  },
];

export default function Home() {
  const refScrollContainer = useRef(null);
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [isClient, setIsClient] = useState<boolean>(false);
  const [splineLoaded, setSplineLoaded] = useState<boolean>(false);
  const [visibleVideos, setVisibleVideos] = useState<Set<string>>(new Set());

  // Set client-side flag to prevent hydration mismatch
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Lazy load Spline only when in viewport
  useEffect(() => {
    if (!isClient) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !splineLoaded) {
            setSplineLoaded(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.1 }
    );

    const splineContainer = document.getElementById("canvas-container");
    if (splineContainer) {
      observer.observe(splineContainer);
    }

    return () => observer.disconnect();
  }, [isClient, splineLoaded]);

  // Lazy load videos when in viewport
  useEffect(() => {
    if (!isClient) return;

    const loadedVideos = new Set<string>();

    const videoObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const video = entry.target as HTMLVideoElement;
            const src = video.getAttribute("data-src");
            if (src && !loadedVideos.has(src)) {
              loadedVideos.add(src);
              video.src = src;
              video.load();
              setVisibleVideos((prev) => new Set(prev).add(src));
              videoObserver.unobserve(video);
            }
          }
        });
      },
      { rootMargin: "100px" }
    );

    // Use setTimeout to ensure DOM is ready
    const timeoutId = setTimeout(() => {
      const videos = document.querySelectorAll("video[data-src]");
      videos.forEach((video) => videoObserver.observe(video));
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      videoObserver.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isClient]);

  // handle scroll - lazy load locomotive scroll
  useEffect(() => {
    if (!isClient) return;

    const sections = document.querySelectorAll("section");
    const navLinks = document.querySelectorAll(".nav-link");

    type LocomotiveInstance = {
      destroy: () => void;
    };
    let locomotiveInstance: LocomotiveInstance | null = null;

    // Only load locomotive scroll after initial render
    const loadLocomotive = async () => {
      // Small delay to prioritize initial content
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      const Locomotive = (await import("locomotive-scroll")).default;
      locomotiveInstance = new Locomotive({
        el: refScrollContainer.current ?? new HTMLElement(),
        smooth: true,
      }) as LocomotiveInstance;
    };

    function handleScroll() {
      let current = "";
      setIsScrolled(window.scrollY > 0);

      sections.forEach((section) => {
        const sectionTop = section.offsetTop;
        if (window.scrollY >= sectionTop - 250) {
          current = section.getAttribute("id") ?? "";
        }
      });

      navLinks.forEach((li) => {
        li.classList.remove("nav-active");
        if (li.getAttribute("href") === `#${current}`) {
          li.classList.add("nav-active");
        }
      });
    }

    void loadLocomotive();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (locomotiveInstance) {
        locomotiveInstance.destroy();
      }
    };
  }, [isClient]);

  return (
    <Container>
      <div ref={refScrollContainer}>
        <Gradient />

        {/* Intro */}
        <section
          id="home"
          data-scroll-section
          className="mt-40 flex w-full flex-col items-center xl:mt-0 xl:min-h-screen xl:flex-row xl:justify-between"
        >
          <div className={styles.intro}>
            <div
              data-scroll
              data-scroll-direction="horizontal"
              data-scroll-speed=".09"
              className="flex flex-row items-center space-x-1.5"
            >
              <span className={styles.pill}>React</span>
              <span className={styles.pill}>next.js</span>
              <span className={styles.pill}>tailwindcss</span>
              <span className={styles.pill}>typescript</span>
            </div>
            <div>
              <h1
                data-scroll
                data-scroll-enable-touch-speed
                data-scroll-speed=".06"
                data-scroll-direction="horizontal"
              >
                <span className="text-6xl tracking-tighter text-foreground 2xl:text-8xl">
                  Hello, I&apos;m
                  <br />
                </span>
                <span className="clash-grotesk text-gradient text-6xl 2xl:text-8xl">
                  Deven.
                </span>
              </h1>
              <p
                data-scroll
                data-scroll-enable-touch-speed
                data-scroll-speed=".06"
                className="mt-1 max-w-lg tracking-tight text-muted-foreground 2xl:text-xl"
              >
                An experienced full-stack website developer with a passion for
                crafting unique digital experiences.
              </p>
            </div>
            <span
              data-scroll
              data-scroll-enable-touch-speed
              data-scroll-speed=".06"
              className="flex flex-row items-center space-x-1.5 pt-6"
            >
              <Button asChild>
                <a
                  href="mailto:devenpuri03@gmail.com?subject=Portfolio%20Inquiry&body=Hello%20Deven,%0D%0A%0D%0AI%20would%20like%20to%20get%20in%20touch%20with%20you."
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Get in touch <ChevronRight className="ml-1 h-4 w-4" />
                </a>
              </Button>
              <Button
                variant="outline"
                onClick={() => scrollTo(document.querySelector("#about"))}
              >
                Learn more
              </Button>
              <Button
                variant="outline"
                asChild
              >
                <a
                  href="/DevenPuri.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  download="DevenPuri_Resume.pdf"
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Resume
                </a>
              </Button>
            </span>

            <div
              className={cn(
                styles.scroll,
                isScrolled && styles["scroll--hidden"],
              )}
            >
              Scroll to discover{" "}
              <TriangleDownIcon className="mt-1 animate-bounce" />
            </div>
          </div>
          <div
            data-scroll
            data-scroll-speed="-.01"
            id="canvas-container"
            className="mt-14 h-full w-full xl:mt-0"
          >
            {splineLoaded ? (
              <Suspense fallback={
                <div className="flex h-full w-full items-center justify-center bg-primary/5 rounded-3xl">
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                </div>
              }>
                <Spline scene="/assets/scene.splinecode" />
              </Suspense>
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-primary/5 rounded-3xl">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              </div>
            )}
          </div>
        </section>

        {/* About */}
        <section id="about" data-scroll-section>
          <div
            data-scroll
            data-scroll-speed=".4"
            data-scroll-position="top"
            className="my-14 flex max-w-6xl flex-col justify-start space-y-10"
          >
            <h2 className="py-16  pb-2 text-3xl font-light leading-normal tracking-tighter text-foreground xl:text-[40px]">
              Dedicated Frontend Developer with 1+ years of experience using{" "}
              <Link
                href="https://create.t3.gg/"
                target="_blank"
                className="underline"
              >
                TypeScript, React and Next.js
              </Link>
              . I specialize in creating clean, user-friendly apps from the
              initial wireframe to the final launch. My recent work includes an
              AI Financer and a Food Ordering platform. I am a frontend expert
              and am currently expanding my skills into backend development to
              build complete, end-to-end applications
            </h2>
            <div className="grid grid-cols-2 gap-8 xl:grid-cols-3">
              {aboutStats.map((stat) => (
                <div
                  key={stat.label}
                  className="flex flex-col items-center text-center xl:items-start xl:text-start"
                >
                  <span className="clash-grotesk text-gradient text-4xl font-semibold tracking-tight xl:text-6xl">
                    {stat.value}
                  </span>
                  <span className="tracking-tight text-muted-foreground xl:text-lg">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Projects */}
        <section id="projects" data-scroll-section>
          {/* Gradient */}
          <div className="relative isolate -z-10">
            <div
              className="absolute inset-x-0 -top-40 transform-gpu overflow-hidden blur-[100px] sm:-top-80 lg:-top-60"
              aria-hidden="true"
            >
              <div
                className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-primary via-primary to-secondary opacity-10 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
                style={{
                  clipPath:
                    "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
                }}
              />
            </div>
          </div>
          <div data-scroll data-scroll-speed=".4" className="my-64">
            <span className="text-gradient clash-grotesk text-sm font-semibold tracking-tighter">
              ✨ Projects
            </span>
            <h2 className="mt-3 text-4xl font-semibold tracking-tight tracking-tighter xl:text-6xl">
              Streamlined digital experiences.
            </h2>
            <p className="mt-1.5 text-base tracking-tight text-muted-foreground xl:text-lg">
              I&apos;ve worked on a variety of projects, from small websites to
              large-scale web applications. Here are some of my favorites:
            </p>

            {/* Horizontal Scrolling Projects */}
            <div className="mt-14">
              <div className="flex gap-6 overflow-x-auto pb-6 scrollbar-hide scroll-smooth">
                {projects.map((project) => (
                  <div
                    key={project.title}
                    className="flex-shrink-0 w-full md:w-[600px]"
                  >
                    <Link href={project.href} target="_blank" passHref className="block">
                      <Card className="h-full transition-transform hover:scale-[1.02] cursor-pointer">
                        <CardHeader className="p-0">
                          {isClient ? (
                            <video
                              data-src={project.image}
                              autoPlay
                              loop
                              muted
                              playsInline
                              className="aspect-video h-full w-full rounded-t-md bg-primary object-cover"
                              poster=""
                              preload="none"
                            />
                          ) : (
                            <div className="aspect-video h-full w-full rounded-t-md bg-primary object-cover flex items-center justify-center">
                              <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                            </div>
                          )}
                        </CardHeader>
                        <CardContent className="bg-background/50 backdrop-blur">
                          <CardTitle className="p-4 text-lg font-semibold tracking-tighter">
                            {project.title}
                          </CardTitle>
                          <p className="px-4 pb-4 text-sm tracking-tight text-muted-foreground">
                            {project.description}
                          </p>
                        </CardContent>
                      </Card>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Services */}
        <section id="services" data-scroll-section>
          <div
            data-scroll
            data-scroll-speed=".4"
            data-scroll-position="top"
            className="my-24 flex flex-col justify-start space-y-10"
          >
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{
                duration: 1,
                staggerChildren: 0.5,
              }}
              viewport={{ once: true }}
              className="grid items-center gap-1.5 md:grid-cols-2 xl:grid-cols-3"
            >
              <div className="flex flex-col py-6 xl:p-6">
                <h2 className="text-4xl font-medium tracking-tight">
                  Need more info?
                  <br />
                  <span className="text-gradient clash-grotesk tracking-normal">
                    I got you.
                  </span>
                </h2>
                <p className="mt-2 tracking-tighter text-secondary-foreground">
                  Here are some of the services I offer. If you have any
                  questions, feel free to reach out.
                </p>
              </div>
              {services.map((service) => (
                <div
                  key={service.service}
                  className="flex flex-col items-start rounded-md bg-white/5 p-14 shadow-md backdrop-blur transition duration-300 hover:-translate-y-0.5 hover:bg-white/10 hover:shadow-md"
                >
                  <service.icon className="my-6 text-primary" size={20} />
                  <span className="text-lg tracking-tight text-foreground">
                    {service.service}
                  </span>
                  <span className="mt-2 tracking-tighter text-muted-foreground">
                    {service.description}
                  </span>
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Contact */}
        <section id="contact" data-scroll-section className="my-64">
          <div
            data-scroll
            data-scroll-speed=".4"
            data-scroll-position="top"
            className="flex flex-col items-center justify-center rounded-lg bg-gradient-to-br from-primary/[6.5%] to-white/5 px-8 py-16 text-center xl:py-24"
          >
            <h2 className="text-4xl font-medium tracking-tighter xl:text-6xl">
              Let&apos;s work{" "}
              <span className="text-gradient clash-grotesk">together.</span>
            </h2>
            <p className="mt-1.5 text-base tracking-tight text-muted-foreground xl:text-lg">
              I&apos;m currently available for freelance work and open to
              discussing new projects.
            </p>
            <Button asChild className="mt-6">
              <a
                href="mailto:devenpuri03@gmail.com?subject=Portfolio%20Inquiry&body=Hello%20Deven,%0D%0A%0D%0AI%20would%20like%20to%20get%20in%20touch%20with%20you."
                target="_blank"
                rel="noopener noreferrer"
              >
                Get in touch <ChevronRight className="ml-1 h-4 w-4" />
              </a>
            </Button>
          </div>
        </section>
      </div>
    </Container>
  );
}

function Gradient() {
  return (
    <>
      {/* Upper gradient */}
      <div className="absolute -top-40 right-0 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
        <svg
          className="relative left-[calc(50%-11rem)] -z-10 h-[21.1875rem] max-w-none -translate-x-1/2 rotate-[30deg] sm:left-[calc(50%-30rem)] sm:h-[42.375rem]"
          viewBox="0 0 1155 678"
        >
          <path
            fill="url(#45de2b6b-92d5-4d68-a6a0-9b9b2abad533)"
            fillOpacity=".1"
            d="M317.219 518.975L203.852 678 0 438.341l317.219 80.634 204.172-286.402c1.307 132.337 45.083 346.658 209.733 145.248C936.936 126.058 882.053-94.234 1031.02 41.331c119.18 108.451 130.68 295.337 121.53 375.223L855 299l21.173 362.054-558.954-142.079z"
          />
          <defs>
            <linearGradient
              id="45de2b6b-92d5-4d68-a6a0-9b9b2abad533"
              x1="1155.49"
              x2="-78.208"
              y1=".177"
              y2="474.645"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#7980fe" />
              <stop offset={1} stopColor="#f0fff7" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Lower gradient */}
      <div className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]">
        <svg
          className="relative left-[calc(50%+3rem)] h-[21.1875rem] max-w-none -translate-x-1/2 sm:left-[calc(50%+36rem)] sm:h-[42.375rem]"
          viewBox="0 0 1155 678"
        >
          <path
            fill="url(#ecb5b0c9-546c-4772-8c71-4d3f06d544bc)"
            fillOpacity=".1"
            d="M317.219 518.975L203.852 678 0 438.341l317.219 80.634 204.172-286.402c1.307 132.337 45.083 346.658 209.733 145.248C936.936 126.058 882.053-94.234 1031.02 41.331c119.18 108.451 130.68 295.337 121.53 375.223L855 299l21.173 362.054-558.954-142.079z"
          />
          <defs>
            <linearGradient
              id="ecb5b0c9-546c-4772-8c71-4d3f06d544bc"
              x1="1155.49"
              x2="-78.208"
              y1=".177"
              y2="474.645"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#9A70FF" />
              <stop offset={1} stopColor="#838aff" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </>
  );
}
