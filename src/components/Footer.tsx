import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { MailIcon } from "lucide-react";

export default function Footer() {
  // get the current time in UTC+1 time zone
  const [time, setTime] = useState<string>("");

  useEffect(() => {
    const interval = setInterval(() => {
      const date = new Date();
      date.setHours(date.getHours());
      setTime(
        date.toLocaleTimeString("en-US", {
          hour12: true,
          hour: "numeric",
          minute: "numeric",
        }),
      );
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <footer className="w-full bg-gradient-to-t from-primary/[1%] to-transparent">
      <div className="container mx-auto flex flex-row items-center justify-between py-6">
        <span className="flex flex-row items-center space-x-4">
          <p className="text-xs text-muted-foreground">
            Made with ❤️ by{" "}
            <Link
              href="https://github.com/Deven-puri"
              target="_blank"
              passHref
              className="text-foreground transition hover:text-primary"
            >
              Deven
            </Link>
          </p>
          <hr className="hidden h-6 border-l border-muted md:flex" />
          <span className="flex hidden flex-row items-center space-x-2 md:flex">
            <p className="text-xs text-muted-foreground">Local time:</p>
            <p className="text-sm font-semibold">{time} UTC+1</p>
          </span>
          <div className="flex justify-center gap-4 mt-10 pb-10">
  <a
  href="https://github.com/Deven-puri"
  target="_blank"
  rel="noopener noreferrer"
>
  <img className="bg translate-x-0 hover:translate-x-1 transition-transform"
    src="https://imgs.search.brave.com/CsEoLEUpQ5LI_L08GsryeVWv3MwJECUg9u4u8cwyQXo/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/cG5nYWxsLmNvbS93/cC1jb250ZW50L3Vw/bG9hZHMvMjAxNi8w/NC9HaXRodWItUE5H/LUltYWdlLnBuZw"
    alt="GitHub"
    className="h-8 w-8 hover:opacity-80 transition"
  />
</a>

<a
  href="https://www.linkedin.com/in/deven-puri-76a898257/"
  target="_blank"
  rel="noopener noreferrer"
>
  <img className="bg translate-x-0 hover:translate-x-1 transition-transform"
    src="https://imgs.search.brave.com/7J5q-_AIUHMuj3gcI6erl9Pqtsz4PnQ3lbvwsOb0pDc/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/cG5nYWxsLmNvbS93/cC1jb250ZW50L3Vw/bG9hZHMvMTMvTGlu/a2VkaW4tTG9nby1Q/TkctUGljdHVyZS5w/bmc"
    alt="LinkedIn"
    className="h-8 w-8 hover:opacity-80 transition"
  />
</a>

</div>


        </span>
        
        <Link
              href="https://mail.google.com/mail/?view=cm&fs=1&to=devenpuri03@gmail.com"
              target="_blank"
              rel="noopener noreferrer"
              passHref
            >
          <Button variant={"outline"}>
            <MailIcon className="h-4 w-4 md:mr-2" />
            <span className="hidden md:flex">devenpuri03@gmail.com</span>
          </Button>
        </Link>
      </div>
      <div className="h-1 bg-[radial-gradient(closest-side,#8486ff,#42357d,#5d83ff,transparent)] opacity-50" />
    </footer>
  );
}
