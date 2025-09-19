import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { cn } from "../../lib/utils"; // Corrected path

// Context for managing sidebar state
const SidebarContext = React.createContext(undefined);

const SidebarProvider = ({ children }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const toggle = React.useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const value = React.useMemo(() => ({ isOpen, toggle, setIsOpen }), [isOpen, toggle]);

  return <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>;
};

// Hook to use sidebar context
const useSidebar = () => {
  const context = React.useContext(SidebarContext);
  if (context === undefined) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};

// Sidebar component
const Sidebar = React.forwardRef(({ className, ...props }, ref) => {
  const { isOpen, setIsOpen } = useSidebar();

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50"
          onClick={() => setIsOpen(false)}
        />
      )}
      <aside
        ref={ref}
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 -translate-x-full transition-transform duration-300 ease-in-out",
          isOpen && "translate-x-0",
          "flex flex-col",
          className
        )}
        aria-hidden={!isOpen}
        {...props}
      />
    </>
  );
});
Sidebar.displayName = "Sidebar";

// SidebarHeader
const SidebarHeader = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex items-center p-4", className)} {...props} />
));
SidebarHeader.displayName = "SidebarHeader";

// SidebarContent
const SidebarContent = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex-1 overflow-y-auto", className)} {...props} />
));
SidebarContent.displayName = "SidebarContent";

// SidebarFooter
const SidebarFooter = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("mt-auto p-4", className)} {...props} />
));
SidebarFooter.displayName = "SidebarFooter";

// SidebarTrigger
const SidebarTrigger = React.forwardRef(({ className, children, ...props }, ref) => {
  const { toggle } = useSidebar();
  return (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
        "h-9 w-9",
        className
      )}
      onClick={toggle}
      {...props}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-5 w-5"
      >
        <line x1="3" x2="21" y1="6" y2="6" />
        <line x1="3" x2="21" y1="12" y2="12" />
        <line x1="3" x2="21" y1="18" y2="18" />
      </svg>
      <span className="sr-only">Toggle sidebar</span>
      {children}
    </button>
  );
});
SidebarTrigger.displayName = "SidebarTrigger";

// SidebarMenu
const SidebarMenu = React.forwardRef(({ className, ...props }, ref) => (
  <ul ref={ref} className={cn("space-y-1", className)} {...props} />
));
SidebarMenu.displayName = "SidebarMenu";

// SidebarMenuItem
const SidebarMenuItem = React.forwardRef(({ className, ...props }, ref) => (
  <li ref={ref} className={cn("relative", className)} {...props} />
));
SidebarMenuItem.displayName = "SidebarMenuItem";

// SidebarMenuButton
const sidebarMenuButtonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-transparent hover:bg-accent hover:text-accent-foreground",
      },
      size: {
        default: "h-9 px-4 py-2",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

const SidebarMenuButton = React.forwardRef(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(sidebarMenuButtonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
SidebarMenuButton.displayName = "SidebarMenuButton";

// SidebarGroup
const SidebarGroup = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("mb-4 last:mb-0", className)} {...props} />
));
SidebarGroup.displayName = "SidebarGroup";

// SidebarGroupLabel
const SidebarGroupLabel = React.forwardRef(({ className, ...props }, ref) => (
  <h4
    ref={ref}
    className={cn(
      "text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2",
      className
    )}
    {...props}
  />
));
SidebarGroupLabel.displayName = "SidebarGroupLabel";

// SidebarGroupContent
const SidebarGroupContent = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("space-y-1", className)} {...props} />
));
SidebarGroupContent.displayName = "SidebarGroupContent";

export {
  Sidebar,
  SidebarProvider,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarTrigger,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  useSidebar,
};
