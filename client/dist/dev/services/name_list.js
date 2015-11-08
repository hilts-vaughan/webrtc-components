var NameList = (function () {
    function NameList() {
        this.names = ['Software Engineering #1', 'Software Engineering #2'];
    }
    NameList.prototype.get = function () {
        return this.names;
    };
    NameList.prototype.add = function (value) {
        this.names.push(value);
    };
    return NameList;
})();
exports.NameList = NameList;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNlcnZpY2VzL25hbWVfbGlzdC50cyJdLCJuYW1lcyI6WyJOYW1lTGlzdCIsIk5hbWVMaXN0LmNvbnN0cnVjdG9yIiwiTmFtZUxpc3QuZ2V0IiwiTmFtZUxpc3QuYWRkIl0sIm1hcHBpbmdzIjoiQUFHQTtJQUFBQTtRQUNFQyxVQUFLQSxHQUFHQSxDQUFDQSx5QkFBeUJBLEVBQUVBLHlCQUF5QkEsQ0FBQ0EsQ0FBQ0E7SUFPakVBLENBQUNBO0lBTkNELHNCQUFHQSxHQUFIQTtRQUNFRSxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQSxLQUFLQSxDQUFDQTtJQUNwQkEsQ0FBQ0E7SUFDREYsc0JBQUdBLEdBQUhBLFVBQUlBLEtBQWFBO1FBQ2ZHLElBQUlBLENBQUNBLEtBQUtBLENBQUNBLElBQUlBLENBQUNBLEtBQUtBLENBQUNBLENBQUNBO0lBQ3pCQSxDQUFDQTtJQUNISCxlQUFDQTtBQUFEQSxDQVJBLEFBUUNBLElBQUE7QUFSWSxnQkFBUSxXQVFwQixDQUFBIiwiZmlsZSI6InNlcnZpY2VzL25hbWVfbGlzdC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogUHJvdmlkZXMgYSBuYW1lZCBsaXN0IGFkYXB0ZXIgZm9yIGRhdGEuXG4gKi9cbmV4cG9ydCBjbGFzcyBOYW1lTGlzdCB7XG4gIG5hbWVzID0gWydTb2Z0d2FyZSBFbmdpbmVlcmluZyAjMScsICdTb2Z0d2FyZSBFbmdpbmVlcmluZyAjMiddO1xuICBnZXQoKTogc3RyaW5nW10ge1xuICAgIHJldHVybiB0aGlzLm5hbWVzOyAgICBcbiAgfVxuICBhZGQodmFsdWU6IHN0cmluZyk6IHZvaWQge1xuICAgIHRoaXMubmFtZXMucHVzaCh2YWx1ZSk7XG4gIH1cbn1cbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==