import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { HelpCircle, Plus, Minus } from 'lucide-react';

export default function FAQ() {
  const [openSection, setOpenSection] = React.useState<number | null>(null);

  const faqs = [
    {
      question: "How long does shipping take?",
      answer: "Standard shipping typically takes 5-7 business days within the continental US. Express shipping options are available at checkout for faster delivery."
    },
    {
      question: "What is your return policy?",
      answer: "We accept returns within 30 days of delivery for items in their original condition. Please visit our Returns & Exchanges page for detailed information."
    },
    {
      question: "Do you ship internationally?",
      answer: "Yes, we ship to over 100 countries worldwide. International shipping times vary by location and typically take 7-14 business days."
    },
    {
      question: "How can I track my order?",
      answer: "Once your order ships, you'll receive a tracking number via email. You can also track your order through your account dashboard."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and Apple Pay."
    },
    {
      question: "Are my payment details secure?",
      answer: "Yes, we use industry-standard SSL encryption to protect your payment information. We never store your credit card details."
    },
    {
      question: "Can I modify or cancel my order?",
      answer: "Orders can be modified or cancelled within 1 hour of placement. Please contact customer service immediately for assistance."
    },
    {
      question: "Do you offer gift wrapping?",
      answer: "Yes, gift wrapping is available for most items at checkout for a small additional fee. Gift messages can be added free of charge."
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-4xl font-bold text-center mb-8">Frequently Asked Questions</h1>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HelpCircle className="h-6 w-6" />
            Common Questions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="border rounded-lg">
              <button
                className="w-full px-4 py-3 flex justify-between items-center hover:bg-gray-50"
                onClick={() => setOpenSection(openSection === index ? null : index)}
              >
                <span className="font-medium text-left">{faq.question}</span>
                {openSection === index ? (
                  <Minus className="h-5 w-5 flex-shrink-0" />
                ) : (
                  <Plus className="h-5 w-5 flex-shrink-0" />
                )}
              </button>
              {openSection === index && (
                <div className="px-4 py-3 border-t">
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}