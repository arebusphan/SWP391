const HealthCheckForm = () => {
    return (
        <div>
            <h2>Submit Health Check Request</h2>
            <form>
                <input placeholder="Height (cm)" />
                <input placeholder="Weight (kg)" />
                <input placeholder="Vision" />
                <button type="submit">Submit</button>
            </form>
        </div>
    );
};

export default HealthCheckForm;
