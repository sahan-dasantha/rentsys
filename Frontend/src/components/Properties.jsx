const Properties = () => {
  return (
    <section className="bg-light py-5">
      <div className="container">
        <h2 className="text-center mb-4">Featured Properties</h2>

        <div className="row">
          <div className="col-md-4">
            <div className="card">
              <img
                src="https://placehold.co/400x300?text=Modern+House"
                className="card-img-top"
              />
              <div className="card-body">
                <h5>Modern House</h5>
                <p>$500/month</p>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card">
              <img
                src="https://placehold.co/400x300?text=Apartment"
                className="card-img-top"
              />
              <div className="card-body">
                <h5>Apartment</h5>
                <p>$300/month</p>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card">
              <img
                src="https://placehold.co/400x300?text=Luxury+Villa"
                className="card-img-top"
              />
              <div className="card-body">
                <h5>Luxury Villa</h5>
                <p>$900/month</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Properties;
