const rootUrl = "http://chat-backend-alb-1721051390.eu-central-1.elb.amazonaws.com";

export const environment = {
	production: false,
	rootUrl: rootUrl,
	apiUrl: `${rootUrl}/api`,
	featureXEnabled: true,
	googleClientId: "17871673269-58p5sm10g9cpe3uanpiulr1v7upuctse.apps.googleusercontent.com",
	facebookClientId: "1255188495616944",
	indexDBName: "chat-db",
	indexDBTableName: "cache"
};
