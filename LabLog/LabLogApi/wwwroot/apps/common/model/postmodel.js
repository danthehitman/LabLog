define(['ko'],
    function (ko) {
       return function postModel() {
            var self = this;            

            self.id = ko.observable();
            self.title = ko.observable("");
            self.body = ko.observable("");
            self.summaryBody = ko.computed(function () {
                var body = self.body();
                var summary = body.substring(body.indexOf('<p>'));
                summary = summary.substring(0, body.indexOf('</p>'));
                return summary;
            });
            self.firstImage = ko.computed(function () {
                var body = self.body();
                if (body.indexOf('<img') < 0)
                    return null;

                var image = body.substring(body.indexOf('<img'));
                image = image.substring(0, image.indexOf('>') + 1);
                return image;
            });
            self.tags = ko.observableArray();
            self.byLine = ko.observable("");
            self.publishedDate = ko.observable();

            self.getDto = function () {
                return {
                    id: self.id(),
                    title: self.title(),
                    body: self.body(),
                    tags: self.tags(),
                    byLine: self.byLine(),
                    publishedDate: self.publishedDate()
                };
            };

            self.loadFromJson = function (json) {
                var object = JSON.parse(json);
                self.loadFromObject(object);
            };

            self.loadFromObject = function (object) {
                self.id(object.id || "");
                self.title(object.title || "");
                self.body(object.body || "");
                self.tags(object.tags || "");
                self.byLine(object.byLine || "");
                self.publishedDate(object.publishedDate || "");
            };
        };
    }
);