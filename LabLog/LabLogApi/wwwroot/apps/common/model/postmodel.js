define(['ko'],
    function (ko) {
       return function postModel() {
            var self = this;            

            self.id = ko.observable();
            self.title = ko.observable("");
            self.body = ko.observable("");
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
                self.id(object.id);
                self.title(object.title);
                self.body(object.body);
                self.tags(object.tags);
                self.byLine(object.byLine);
                self.publishedDate(object.publishedDate);
            };
        };
    }
);