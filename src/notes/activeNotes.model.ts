import { Column, DataType, Model, Table } from "sequelize-typescript";

interface NoteCreationAttr {
    title: string;
    content: string;
    category: string;
}

@Table({ tableName: "active" })
class ActiveNote extends Model<ActiveNote, NoteCreationAttr> {
    @Column({
        type: DataType.INTEGER,
        unique: true,
        autoIncrement: true,
        primaryKey: true,
    })
    id: number;

    @Column({
        type: DataType.STRING,
        unique: true,
        allowNull: false,
        defaultValue: String(Date.now()),
    })
    title: string;

    @Column({
        type: DataType.STRING,
        unique: true,
        allowNull: false,
        defaultValue: String(Date.now()),
    })
    slug: string;

    @Column({
        type: DataType.TEXT,
        allowNull: false,
        defaultValue: String(Date.now()),
    })
    content: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
        defaultValue: String(Date.now()),
    })
    category: string;

    @Column({
        type: DataType.ARRAY(DataType.STRING),
    })
    parseddates: string[];
}

export default ActiveNote;
