export default function ProfileHeader() {
    const user = {
        name: "User",
        bio: "Bio description"
    };

    return (
        <div>
            <div>
                Adding a image
            </div>
            <div>
                <h1>{user.name}</h1>
                <h4>{user.bio}</h4>
            </div>
        </div>
    )
}