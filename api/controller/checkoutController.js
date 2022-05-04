class CheckoutController {
	newCheckout(req, res) {
		if(!req.body.checkout) res.status(400).send();
		res.status(200).send();
	}
}

module.exports = new CheckoutController();