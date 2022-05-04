class NewsletterController {
	subscribeToNewsletter(req, res) {
		console.log(`Newsletter subscription request: ${req.body.email}`);
		res.status(202).send();
	}
}

module.exports = new NewsletterController();