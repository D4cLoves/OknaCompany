import os

def find_matching_div(html, start_pos):
    pos = start_pos
    depth = 0
    while pos < len(html):
        if html[pos:].startswith("<div"):
            next_char = html[pos+4]
            if next_char in (' ', '>'):
                depth += 1
                pos += 4
                continue
        elif html[pos:].startswith("</div>"):
            depth -= 1
            if depth == 0:
                return pos + 6
            pos += 6
            continue
        pos += 1
    return -1

html_path = r"c:\Users\vladi\OneDrive\Документы\CompanyWindow\index.html"

with open(html_path, "r", encoding="utf-8") as f:
    html = f.read()

# Replace "Срок выполнения работ:" back to "Срок выполнения:"
html = html.replace('Срок выполнения работ:', 'Срок выполнения:')

pos = 0
count = 0
while True:
    card_index = html.find('class="case-card"', pos)
    if card_index == -1:
        break
    
    div_start = html.rfind('<div', 0, card_index)
    if div_start == -1:
        pos = card_index + 1
        continue
    
    div_end = find_matching_div(html, div_start)
    if div_end == -1:
        pos = card_index + 1
        continue
    
    card_content = html[div_start:div_end]
    
    # In restructured html, the case-thumbnails is at the bottom of the card,
    # and case-visuals is empty after the img.
    thumb_class_idx = card_content.find('class="case-thumbnails"')
    if thumb_class_idx == -1:
        pos = div_end
        continue
        
    thumb_start = card_content.rfind('<div', 0, thumb_class_idx)
    thumb_end = find_matching_div(card_content, thumb_start)
    
    if thumb_end == -1:
        pos = div_end
        continue
    
    thumbnails_block = card_content[thumb_start:thumb_end]
    
    # Remove thumbnails from the bottom
    new_card_content = card_content[:thumb_start] + card_content[thumb_end:]
    
    # Now find <div class="case-visuals"> inside new_card_content
    visuals_class_idx = new_card_content.find('class="case-visuals"')
    if visuals_class_idx == -1:
        pos = div_end
        continue
        
    visuals_start = new_card_content.rfind('<div', 0, visuals_class_idx)
    # The end of case-visuals is the closing </div>
    visuals_end = find_matching_div(new_card_content, visuals_start)
    if visuals_end == -1:
        pos = div_end
        continue
        
    # We insert the thumbnails block inside case-visuals before its closing </div>
    last_div_idx = new_card_content.rfind('</div>', visuals_start, visuals_end)
    if last_div_idx == -1:
        pos = div_end
        continue
        
    # Find indentation of the closing div of case-visuals
    indent_line_start = new_card_content.rfind('\n', visuals_start, last_div_idx)
    if indent_line_start != -1:
        indent = new_card_content[indent_line_start+1:last_div_idx]
    else:
        indent = "                                "
        
    # Format thumbnails_block with proper case-visuals inner indent (36 spaces or 32 spaces)
    thumb_lines = [line.strip() for line in thumbnails_block.strip().split('\n')]
    reconstructed_thumb_block = []
    # outer div has 36 spaces, inner imgs have 40 spaces
    reconstructed_thumb_block.append("                                    " + thumb_lines[0])
    for line in thumb_lines[1:-1]:
        reconstructed_thumb_block.append("                                        " + line)
    reconstructed_thumb_block.append("                                    " + thumb_lines[-1])
    reconstructed_thumb_block_str = "\n".join(reconstructed_thumb_block)
    
    final_card_content = (
        new_card_content[:last_div_idx] +
        reconstructed_thumb_block_str + "\n" +
        new_card_content[last_div_idx:]
    )
    
    html = html[:div_start] + final_card_content + html[div_end:]
    pos = div_start + len(final_card_content)
    count += 1

with open(html_path, "w", encoding="utf-8") as f:
    f.write(html)

print(f"Reverted {count} case cards HTML.")
