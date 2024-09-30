export const metadata = {
  title: "Home",
  descritption: "Created by Sunny Sharma",
};

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
