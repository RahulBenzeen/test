import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { subscribeToNewsletter } from "../../store/subscriptionSlice"; // Adjusted import path
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const dispatch = useAppDispatch();
  const { loading, success, error } = useAppSelector((state) => state.subscription);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      alert("Please enter a valid email address");
      return;
    }

    dispatch(subscribeToNewsletter(email));
  };


const handleReset = () => {}
  return (
    <section className="py-16">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
          Subscribe to our newsletter for exclusive offers and new arrivals
        </p>
        {success ? (
          <div className="max-w-md mx-auto">
            <p className="text-green-600 font-semibold mb-4">
              Thank you for subscribing! 🎉
            </p>
            <Button onClick={handleReset}>Subscribe Another Email</Button>
          </div>
        ) : (
          <form onSubmit={ (e) => handleSubmit(e)} className="flex gap-4 max-w-md mx-auto">
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="flex-1"
            />
            <Button type="submit" disabled={loading}>
              {loading ? "Subscribing..." : "Subscribe"}
            </Button>
          </form>
        )}
        {error && (
          <p className="text-red-600 font-semibold mt-4">
            {error.message}
          </p>
        )}
      </div>
    </section>
  );
}


