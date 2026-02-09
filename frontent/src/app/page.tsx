'use client';

import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, Lock, Smartphone } from 'lucide-react';

export default function Home() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Organize Your Life with{' '}
            <span className="text-primary">Todo App</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8">
            A powerful, secure, and intuitive task management application.
            Stay organized, boost productivity, and never miss a deadline.
          </p>

          {!isAuthenticated ? (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="text-base">
                <Link href="/signup">
                  Get Started Free
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-base">
                <Link href="/signin">
                  Sign In
                </Link>
              </Button>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="text-base">
                <Link href="/dashboard">
                  Go to Dashboard
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-base">
                <Link href="/tasks">
                  View Tasks
                </Link>
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <Card>
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <CheckCircle2 className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>Task Management</CardTitle>
              <CardDescription>
                Create, update, and organize your tasks effortlessly. Track progress and stay on top of your goals.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Lock className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>Secure & Private</CardTitle>
              <CardDescription>
                Your data is protected with industry-standard authentication. Only you can access your tasks.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Smartphone className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>Fully Responsive</CardTitle>
              <CardDescription>
                Access your tasks anywhere, anytime. Optimized for desktop, tablet, and mobile devices.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      {!isAuthenticated && (
        <section className="container mx-auto px-4 py-16">
          <Card className="max-w-3xl mx-auto bg-primary text-primary-foreground">
            <CardContent className="pt-6">
              <div className="text-center">
                <h2 className="text-3xl font-bold mb-4">
                  Ready to Get Organized?
                </h2>
                <p className="text-lg mb-6 opacity-90">
                  Join thousands of users who trust Todo App to manage their daily tasks.
                </p>
                <Button asChild size="lg" variant="secondary">
                  <Link href="/signup">
                    Create Your Free Account
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      )}
    </div>
  );
}
