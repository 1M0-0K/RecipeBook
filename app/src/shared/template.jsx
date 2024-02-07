import "./Template.css";

const Template = ({children}) => {
    return (
        <div className="container">
            {children}
        </div>
    );
};

export default Template;
