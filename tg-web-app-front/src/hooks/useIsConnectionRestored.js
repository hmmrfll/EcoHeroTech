import { useIsConnectionRestored } from '@tonconnect/ui-react';

const EntrypointPage = () => {
    const connectionRestored = useIsConnectionRestored();

    if (!connectionRestored) {
        return <div>Loading... Please wait...</div>;
    }

    return <div>Main Page</div>;
};

export default EntrypointPage;
