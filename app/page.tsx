import { ArrowRight, Globe, Shield, Users } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <main>
        <section className="py-20 text-center">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl font-bold mb-4">Welcome to Refunite</h1>
            <p className="text-xl mb-8">
              Empowering refugee communities through decentralized trust networks
            </p>
            <Button size="lg">
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </section>

        <section id="about" className="py-20 bg-muted">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8 text-center">About Refunite</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4">Our Mission</h3>
                <p>
                  Refunite is the world&apos;s largest missing persons platform for refugees and
                  displaced populations. We aim to empower our network of 100,000 community leaders
                  representing 100 million community members across Africa with decentralized
                  technology.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-4">Our Goal</h3>
                <p>
                  Our goal is to facilitate a trust network within community leaders using
                  decentralized technology. This network will enable efficient management and
                  recovery of leadership roles, enhancing the resilience of our community support
                  system.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-12 text-center">Key Features</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="mr-2 h-6 w-6" />
                    Decentralized Network
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    Empower community leaders with a decentralized trust network, reducing reliance
                    on central authorities.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="mr-2 h-6 w-6" />
                    Social Recovery
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    Enable leaders to recover their roles through peer validation, ensuring
                    continuity of community support.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Globe className="mr-2 h-6 w-6" />
                    Scalable Solution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    Built to support our vast network of 100,000 community leaders across the
                    African continent.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section id="contact" className="py-20 bg-muted">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-8">Get Involved</h2>
            <p className="mb-8">
              Join us in our mission to empower refugee communities. Whether you&apos;re a community
              leader or want to support our cause, we&apos;d love to hear from you.
            </p>
            <Button size="lg">
              Contact Us
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </section>
      </main>
    </div>
  );
}
