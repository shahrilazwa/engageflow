export default function InputError({ message, ...props }) {
    if (!message) {
        return null;
    }

    return (
        <p {...props} className="mt-2 text-sm font-medium text-red-600">
            {message}
        </p>
    );
}
