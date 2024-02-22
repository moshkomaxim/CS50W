import re

from django.core.files.base import ContentFile
from django.core.files.storage import default_storage


def list_entries():
    """
    Returns a list of all names of encyclopedia entries.
    """
    _, filenames = default_storage.listdir("entries")
    return list(sorted(re.sub(r"\.md$", "", filename)
                for filename in filenames if filename.endswith(".md")))


def save_entry(title, content):
    """
    Saves an encyclopedia entry, given its title and Markdown
    content. If an existing entry with the same title already exists,
    it is replaced.
    """
    filename = f"entries/{title}.md"
    if default_storage.exists(filename):
        default_storage.delete(filename)
    default_storage.save(filename, ContentFile(content))


def get_entry(title):
    """
    Retrieves an encyclopedia entry by its title. If no such
    entry exists, the function returns None.
    """
    print(default_storage.listdir("entries")[1])
    try:
        f = default_storage.open(f"entries/{title}.md")
        return f.read().decode("utf-8")
    except FileNotFoundError:
        return None


def search_entry(title):
    entry_list = list_entries()
    found_entry_list = []
    title = title.strip()

    for entry in entry_list:
        if title.lower() == entry.lower():
            return [entry]
        result = re.search(title.strip(), entry.lower())
        if result:
            found_entry_list.append(entry)

    return found_entry_list


def distinct_entry(content):
    name_position = content.find("\n")
    name = content[2:name_position]
    content = content[name_position:]

    return name, content

