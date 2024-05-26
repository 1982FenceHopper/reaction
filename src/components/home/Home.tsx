"use client";

import { BackgroundGradientAnimation } from "@/components/ui/background-gradient-animation";
import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";

import { useToast } from "@/components/ui/use-toast";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  clientLoginHandler,
  clientSignUpHandler,
} from "@/utils/supabase/actions";

const loginFormSchema = z.object({
  email: z.string().email({ message: "Invalid Email Address" }),
  password: z
    .string()
    .min(6, { message: "Password length should be atleast 6 characters" }),
});

const signupFormSchema = z
  .object({
    email: z.string().email({ message: "Invalid Email Address" }),
    password: z
      .string()
      .min(6, { message: "Password length should be atleast 6 characters" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export default function Home() {
  const { toast } = useToast();

  const loginForm = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const signupForm = useForm<z.infer<typeof signupFormSchema>>({
    resolver: zodResolver(signupFormSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onLoginSubmit(values: z.infer<typeof loginFormSchema>) {
    const result = await clientLoginHandler(values);

    const { error } = JSON.parse(result);
    console.log(JSON.parse(result));

    if (error !== null) {
      toast({
        title: "Error Logging In",
        description: "Invalid Email/Password",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Logged In",
        description: "Redirecting...",
      });
    }
  }

  async function onSignupSubmit(values: z.infer<typeof signupFormSchema>) {
    const result = await clientSignUpHandler(values);

    const { error } = JSON.parse(result);

    if (error !== null) {
      toast({
        title: "Error Signing Up",
        description: "Application Failed To Signup. Please try again later.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Account Created",
        description:
          "Redirecting...(If you are not redirected, manually login with your new credentials)",
      });
    }
  }

  return (
    <main>
      <div className="min-w-screen min-h-screen flex m-0 p-0">
        <div className="w-full h-full grayscale">
          <BackgroundGradientAnimation></BackgroundGradientAnimation>
          <div className="absolute left-1/2 top-1/4 translate-x-[-50%] translate-y-[-25%] text-[#00000050] font-bold justify-center leading-tight text-center items-center justify-items-center text-7xl">
            Reaction
          </div>
          <div className="absolute left-1/2 top-1/3 translate-x-[-50%] translate-y-[-33%] text-[#ffffff50] font-bold justify-center leading-tight text-center items-center justify-items-center text-2xl">
            First Class Audio Player
          </div>
        </div>
        <div className="flex absolute left-1/2 top-3/4 translate-x-[-50%] translate-y-[-75%]">
          <div>
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant={"ghost"}
                  className="mr-2 text-[#ffffff50] scale-100 transition-all duration-150 ease-in-out hover:scale-110 hover:text-[#ffffff]"
                >
                  Login
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Login</DialogTitle>
                  <DialogDescription>
                    Login with your email and password
                  </DialogDescription>
                </DialogHeader>
                <Form {...loginForm}>
                  <form
                    onSubmit={loginForm.handleSubmit(onLoginSubmit)}
                    className="space-y-8"
                    id="loginForm"
                  >
                    <FormField
                      control={loginForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="example@domain.com"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            The email used to signup
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={loginForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="••••••••"
                              type="password"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            The password used to signup
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </form>
                </Form>
                <DialogFooter>
                  <Button type="submit" form="loginForm">
                    Login
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          <div>
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant={"ghost"}
                  className="scale-100 text-[#ffffff50] transition-all duration-150 ease-in-out hover:scale-110"
                >
                  Signup
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Signup</DialogTitle>
                  <DialogDescription>
                    Signup with your email and password
                  </DialogDescription>
                </DialogHeader>
                <Form {...signupForm}>
                  <form
                    onSubmit={signupForm.handleSubmit(onSignupSubmit)}
                    className="space-y-8"
                    id="signupForm"
                  >
                    <FormField
                      control={signupForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="example@domain.com"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Enter a email for signup
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={signupForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="••••••••"
                              type="password"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Enter a valid password for signup
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={signupForm.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirm Password</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="••••••••"
                              type="password"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Confirm the password you just entered
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </form>
                </Form>
                <DialogFooter>
                  <Button type="submit" form="signupForm">
                    Signup
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        <div className="absolute left-[1%] top-[99%] translate-x-[-1%] translate-y-[-99%] text-[#ffffff50] text-[0.75rem]">
          Copyright 2024 1982FenceHopper
        </div>
      </div>
    </main>
  );
}
