const VaccinationForm = () => {
    return (
        <div>
            <h2>Submit Vaccination Request</h2>
            <form>
                <input placeholder="Vaccine Name" />
                <input placeholder="Vaccination Date" type="date" />
                <button type="submit">Submit</button>
            </form>
        </div>
    );
};

export default VaccinationForm;
