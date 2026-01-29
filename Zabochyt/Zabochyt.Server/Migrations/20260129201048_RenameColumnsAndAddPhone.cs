using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Zabochyt.Server.Migrations
{
    /// <inheritdoc />
    public partial class RenameColumnsAndAddPhone : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Description",
                table: "TimeSlots");

            migrationBuilder.RenameColumn(
                name: "Name",
                table: "Users",
                newName: "Nickname");

            migrationBuilder.RenameColumn(
                name: "StartTime",
                table: "TimeSlots",
                newName: "Start");

            migrationBuilder.RenameColumn(
                name: "EndTime",
                table: "TimeSlots",
                newName: "End");

            migrationBuilder.RenameColumn(
                name: "Capacity",
                table: "TimeSlots",
                newName: "MaxCapacity");

            migrationBuilder.RenameColumn(
                name: "CreatedAt",
                table: "Registrations",
                newName: "RegisteredAt");

            migrationBuilder.AlterColumn<string>(
                name: "Role",
                table: "Users",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddColumn<string>(
                name: "Phone",
                table: "Users",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Note",
                table: "TimeSlots",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Phone",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "Note",
                table: "TimeSlots");

            migrationBuilder.RenameColumn(
                name: "Nickname",
                table: "Users",
                newName: "Name");

            migrationBuilder.RenameColumn(
                name: "Start",
                table: "TimeSlots",
                newName: "StartTime");

            migrationBuilder.RenameColumn(
                name: "MaxCapacity",
                table: "TimeSlots",
                newName: "Capacity");

            migrationBuilder.RenameColumn(
                name: "End",
                table: "TimeSlots",
                newName: "EndTime");

            migrationBuilder.RenameColumn(
                name: "RegisteredAt",
                table: "Registrations",
                newName: "CreatedAt");

            migrationBuilder.AlterColumn<int>(
                name: "Role",
                table: "Users",
                type: "int",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AddColumn<string>(
                name: "Description",
                table: "TimeSlots",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }
    }
}
