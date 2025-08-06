"use client";

interface WhatsappButtonProps {
    phoneNumber?: string;
    enabled?: boolean;
    defaultMessage?: string;
}

export default function WhatsappButton({
    phoneNumber,
    enabled = true,
    defaultMessage,
}: WhatsappButtonProps) {
    if (!enabled || !phoneNumber) return null;

    const encodedMessage = defaultMessage
        ? encodeURIComponent(defaultMessage)
        : "";

    return (
        <a
            href={`https://wa.me/${phoneNumber}${encodedMessage ? `?text=${encodedMessage}` : ""
                }`}
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-5 right-5 z-50 bg-white text-green-500 rounded-full p-4 shadow-lg border-2 transition-all duration-300 hover:bg-green-500 hover:text-white hover:border-green-600 hover:shadow-xl"
            aria-label="Chat on WhatsApp"
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-8 h-8"
                fill="currentColor"
                viewBox="0 0 24 24"
            >
                <path d="M20.52 3.48a11.79 11.79 0 0 0-16.68 0c-4.41 4.41-4.68 11.48-.84 16.2L2 22l2.41-.63a11.74 11.74 0 0 0 5.5 1.4h.05c3.07 0 5.96-1.2 8.15-3.4a11.81 11.81 0 0 0 0-16.68zM12 21.3a9.51 9.51 0 0 1-4.84-1.3l-.35-.21-2.88.75.77-2.8-.23-.36a9.5 9.5 0 0 1 14.4-12.06 9.52 9.52 0 0 1-6.87 16.98zm5.2-7.3c-.3-.15-1.77-.87-2.05-.97-.27-.1-.48-.15-.68.15s-.78.97-.96 1.17c-.18.2-.35.22-.65.07s-1.26-.46-2.4-1.45a9.07 9.07 0 0 1-1.66-2.06c-.17-.3 0-.46.13-.6.13-.13.3-.35.44-.52.15-.18.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.68-1.63-.94-2.23-.25-.6-.5-.52-.68-.53h-.6c-.2 0-.5.07-.76.37s-1 1-.98 2.42 1 2.78 1.15 2.97c.15.2 2.03 3.1 4.93 4.36.7.3 1.25.48 1.68.6.7.22 1.34.19 1.85.12.57-.08 1.77-.72 2.03-1.4.25-.68.25-1.27.17-1.4-.08-.14-.28-.23-.58-.37z" />
            </svg>
        </a>
    );
}
